// © Copyright 2023 HP Development Company, L.P.
import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import process from "process";
import ts from "typescript";
import MODULE_LIBRARY_NAME from "../library-names.js";
import { MODULE_NAMES } from "../module-names.js";

/**
 * inquirer choice type
 */
type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
  type?: never;
};

/**
 * Writes to a file after optionally creating a parent directory
 */
function writeFile(_path: string, contents: string) {
  fs.mkdirSync(path.dirname(_path), { recursive: true });
  fs.writeFileSync(_path, contents);
}

function toCamelCase(s: string) {
  // https://stackoverflow.com/a/2970667
  return s
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

function toKebabCase(s: string) {
  return s.toLowerCase().replace(/_+/g, "-");
}

function toScreamingCase(s: string) {
  return s.toUpperCase().replace(/\s+/g, "_");
}

function applyTransformer(
  filepath: string,
  transformer: ts.TransformerFactory<ts.Node>
) {
  const fileName = path.basename(filepath);

  const file = fs.readFileSync(filepath).toString();

  const source = ts.createSourceFile(
    fileName,
    file,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );

  const { transformed } = ts.transform(source, [transformer]);

  const resultFile = ts.createSourceFile(
    fileName,
    "",
    ts.ScriptTarget.ES2021, // ESNEXT does not work
    false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.CarriageReturnLineFeed,
  });

  const result = printer.printNode(
    ts.EmitHint.Unspecified,
    transformed[0],
    resultFile
  );

  fs.writeFileSync(filepath, prettier.format(result, { filepath }));
}

const addModuleName: (
  name: string,
  verboseName: string
) => ts.TransformerFactory<ts.Node> =
  (name, verboseName) => (context) => (rootNode) => {
    const visitor = (node: ts.Node): ts.Node => {
      if (
        ts.isEnumDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.name.escapedText === "MODULE_NAMES"
      ) {
        return context.factory.createEnumDeclaration(
          node.modifiers,
          node.name,
          [
            ...node.members,
            context.factory.createEnumMember(
              name,
              context.factory.createStringLiteral(verboseName)
            ),
          ]
        );
      } else {
        return ts.visitEachChild(node, visitor, context);
      }
    };

    return ts.visitNode(rootNode, visitor);
  };

const addModuleToRecord: (
  name: string,
  moduleName: string,
  modulepath: string
) => ts.TransformerFactory<ts.Node> =
  (name, moduleName, modulepath) => (context) => (rootNode) => {
    const visitor = (node: ts.Node): ts.Node => {
      if (
        ts.isVariableDeclaration(node) &&
        node.initializer &&
        ts.isObjectLiteralExpression(node.initializer) &&
        ts.isIdentifier(node.name) &&
        node.name.escapedText === "MODULES"
      ) {
        return context.factory.createVariableDeclaration(
          node.name,
          node.exclamationToken,
          node.type,
          context.factory.createObjectLiteralExpression([
            ...node.initializer.properties,
            context.factory.createPropertyAssignment(
              context.factory.createComputedPropertyName(
                context.factory.createPropertyAccessExpression(
                  context.factory.createIdentifier("MODULE_NAMES"),
                  context.factory.createIdentifier(name)
                )
              ),
              context.factory.createIdentifier(moduleName)
            ),
          ])
        );
      } else if (ts.isSourceFile(node)) {
        const newSourceFile = context.factory.updateSourceFile(node, [
          context.factory.createImportDeclaration(
            undefined,
            context.factory.createImportClause(
              false,
              undefined,
              context.factory.createNamedImports([
                context.factory.createImportSpecifier(
                  false,
                  undefined,
                  context.factory.createIdentifier(moduleName)
                ),
              ])
            ),
            context.factory.createStringLiteral(modulepath)
          ),
          // Ensures the rest of the source files statements are still defined.
          ...node.statements,
        ]);
        return ts.visitEachChild(newSourceFile, visitor, context);
      } else {
        return ts.visitEachChild(node, visitor, context);
      }
    };

    return ts.visitNode(rootNode, visitor);
  };

const addModuleToLibrary: (
  name: string,
  libName: string
) => ts.TransformerFactory<ts.Node> =
  (name, libName) => (context) => (rootNode) => {
    const visitor = (node: ts.Node): ts.Node => {
      if (
        ts.isPropertyAssignment(node) &&
        ts.isComputedPropertyName(node.name) &&
        ts.isPropertyAccessExpression(node.name.expression) &&
        ts.isIdentifier(node.name.expression.expression) &&
        node.name.expression.expression.escapedText === "MODULE_LIBRARY_NAME" &&
        ts.isIdentifier(node.name.expression.name) &&
        node.name.expression.name.escapedText === libName &&
        node.initializer &&
        ts.isObjectLiteralExpression(node.initializer)
      ) {
        const idx = node.initializer.properties.findIndex(
          (n) =>
            ts.isPropertyAssignment(n) &&
            ts.isIdentifier(n.name) &&
            n.name.escapedText === "modules"
        );

        const oldProperty = node.initializer.properties[idx];

        if (
          !ts.isPropertyAssignment(oldProperty) ||
          !ts.isArrayLiteralExpression(oldProperty.initializer)
        )
          return node;

        const properties = [
          ...node.initializer.properties.slice(0, idx),
          context.factory.updatePropertyAssignment(
            oldProperty,
            oldProperty.name,
            context.factory.createArrayLiteralExpression([
              ...oldProperty.initializer.elements,
              context.factory.createPropertyAccessExpression(
                context.factory.createIdentifier("MODULE_NAMES"),
                name
              ),
            ])
          ),
          ...node.initializer.properties.slice(idx + 1),
        ];
        return context.factory.updatePropertyAssignment(
          node,
          node.name,
          context.factory.createObjectLiteralExpression(properties)
        );
      } else {
        return ts.visitEachChild(node, visitor, context);
      }
    };

    return ts.visitNode(rootNode, visitor);
  };

const dir = path.join(process.cwd(), "/src/core/modules/");
if (!fs.existsSync(dir)) {
  console.log("\nCWD: " + process.cwd());
  console.log("Error: new-module.mts should be run from the project root");
  console.log(
    "Example> npx ts-node --esm ./src/core/config/scripts/new-module.mts"
  );
  process.exit(1);
}

console.log(
  "This utility will walk you through creating a new deobfuscation module.\n"
);
console.log("It tries to guess sensible defaults.\n");
console.log("Press ^C at any time to quit\n\n");

const nameRegEx = /([A-Z_])/g;
const isValidName = (value: string) =>
  (value.match(nameRegEx) || []).length === value.length;

(async function () {
  const verboseName = await input({
    message: "Enter your module's name?",
    transformer(value = "", { isFinal }) {
      const color = chalk.hex(value);
      return isFinal ? color.underline(value) : color(value);
    },
    validate: (value = "") => value !== "" || "Enter a name",
  });

  const tempName = toScreamingCase(verboseName);

  const name = await input({
    message: "Enter your module's enum symbol?",
    transformer(value = "", { isFinal }) {
      const color = chalk.hex(isValidName(value) ? value : "fff");
      return isFinal ? color.underline(value) : color(value);
    },
    validate: (value = "") => {
      if (value in MODULE_NAMES) return `${value} is already in use`;
      return isValidName(value) || "Name must match [A-Z_]+";
    },
    default: tempName,
  });

  const choices: Choice<string>[] = Object.keys(MODULE_LIBRARY_NAME).map(
    (value) => ({
      value,
      name: value,
    })
  );

  const library: string = await select({
    message: "Select your module's parent library?",
    choices,
  });

  // TODO:
  // const isUseDefaultComponent = await confirm({
  //   message: "Use the default component?",
  //   default: true,
  // });
  const isUseDefaultComponent = true;

  const isGenerateDocumentation = await confirm({
    message: "Generate template documentation?",
    default: true,
  });

  const documentationTemplate = fs
    .readFileSync("./src/core/config/templates/documentation-template.md")
    .toString();

  const kebabName = toKebabCase(name);
  const kebabLib = toKebabCase(library);

  // Documentation
  if (isGenerateDocumentation) {
    writeFile(
      `./src/core/modules/${kebabLib}/${kebabName}/documentation.md`,
      "# " + verboseName + "\n\n" + documentationTemplate
    );

    console.log(
      `\nCreated documentation template at ./src/core/modules/${kebabLib}/${kebabName}/documentation.md\n`
    );
  }

  const camelName = toCamelCase(verboseName);
  const typeName = camelName[0].toUpperCase() + camelName.slice(1);

  const moduleVisitorTemplate = fs
    .readFileSync("./src/core/config/templates/module-visitor-template.ts")
    .toString()
    .replace(/__NAME__/g, camelName)
    .replace(
      /^.*__DOCUMENTATION__.*$/gm,
      isGenerateDocumentation ? "  documentation,\n" : ""
    )
    .replace(
      /^.*__DOCUMENTATION_IMPORT__.*$/gm,
      isGenerateDocumentation
        ? `import documentation from "./documentation.md";\n`
        : ""
    )
    .replace(/__TYPE__/g, typeName + "Type");

  writeFile(
    `./src/core/modules/${kebabLib}/${kebabName}/${kebabName}.ts`,
    moduleVisitorTemplate
  );

  console.log(
    `\nCreated module template with ${
      isUseDefaultComponent ? "the default component" : "a custom component"
    } at ./src/core/modules/${kebabLib}/${kebabName}/${kebabName}.ts`
  );

  // TYPESCRIPT TRANSFORMERS
  applyTransformer(
    "./src/core/config/module-names.ts",
    addModuleName(name, verboseName)
  );
  console.log("Added your module to ./src/core/config/module-names.ts");

  applyTransformer(
    "./src/core/config/modules.ts",
    addModuleToRecord(
      name,
      camelName,
      `@core/modules/${kebabLib}/${kebabName}/${kebabName}`
    )
  );
  console.log("Added your module to ./src/core/config/modules.ts");

  applyTransformer(
    "./src/core/config/libraries.ts",
    addModuleToLibrary(name, library)
  );
  console.log("Added your module to ./src/core/config/libraries.ts");

  console.log(
    `\n\nYour new module is setup in ./src/core/modules/${kebabLib}/${kebabName}/\nHappy hacking!\n`
  );
})();
