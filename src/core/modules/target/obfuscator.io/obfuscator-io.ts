// © Copyright 2023 HP Development Company, L.P.
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import type { SupportedParams, VisitorModule } from "@core/types";
import { forEachReference, safeFunction } from "@core/utils";
import documentation from "./obfuscator.io.md";

// Ripped from obfuscator io source code
/* eslint-disable */
const atobb = (input: string, alphabet: string) => {
  let output = "";
  let tempEncodedString = "";

  for (
    let bc = 0, bs: any, buffer, idx = 0;
    (buffer = input["charAt"](idx++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String["fromCharCode"](255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = alphabet.indexOf(buffer);
  }
  for (let i = 0, len = output["length"]; i < len; i++) {
    tempEncodedString +=
      "%" + ("00" + output["charCodeAt"](i)["toString"](16))["slice"](-2);
  }
  return decodeURIComponent(tempEncodedString);
};
/* eslint-enable */

// Ripped from obfuscator io source code
/* eslint-disable */
const rc4 = (index: number, key: string, alphabet: string, table: string[]) => {
  let s = [],
    j = 0,
    x,
    output = "";
  let str = atobb(table[(table.length + index) % table.length], alphabet);
  let i;
  for (i = 0; i < 256; i++) {
    s[i] = i;
  }
  for (i = 0; i < 256; i++) {
    j = (j + s[i] + key["charCodeAt"](i % key["length"])) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }
  i = 0;
  j = 0;
  for (let y = 0; y < str["length"]; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
    output += String["fromCharCode"](
      str["charCodeAt"](y) ^ s[(s[i] + s[j]) % 256]
    );
  }
  return output;
};
/* eslint-enable */

interface ObfuscatorIoRc4Params extends SupportedParams {
  fName: string;
  tableName: string;
  offset: number;
  alphabet: string;
  useRC4: boolean;
}

const INITIAL_PARAMS: ObfuscatorIoRc4Params = {
  fName: "_0x28a7",
  offset: 0,
  tableName: "_0x678f",
  alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=",
  useRC4: true,
};

/**
 * obfuscatorIoRc4
 * an attempt
 */
export const obfuscatorIoRc4: VisitorModule = {
  kind: "visitor",
  documentation,
  initialParams: INITIAL_PARAMS,

  visitor: (params?: object) => {
    const { fName, tableName, offset, alphabet, useRC4 } = {
      ...INITIAL_PARAMS,
      ...params,
    };

    return {
      FunctionDeclaration: (path) => {
        const { node, parentPath } = path;
        const { id } = node;

        if (!id || id.name !== fName) return;

        const program = path.findParent((p) => t.isProgram(p));

        if (!program) return;
        let tbl: any = null;

        program.traverse({
          FunctionDeclaration: (path) => {
            const { node } = path;
            const { id } = node;
            if (!id || id.name !== tableName) return;
            tbl = path;
            path.stop();
          },
        });

        if (!tbl || !t.isFunctionDeclaration(tbl.node)) {
          return;
        }

        const tbl2: NodePath<t.FunctionDeclaration> = tbl;

        const tbl2Str = tbl2.toString();

        /* eslint-disable no-new-func */
        const table = safeFunction(`${tbl2Str}; return ${tableName}()`)();

        forEachReference(
          parentPath,
          id.name,
          (referencePath) => {
            const localPath = referencePath.parentPath;

            if (
              !localPath ||
              !t.isCallExpression(localPath.node) ||
              !t.isIdentifier(localPath.node.callee, { name: fName })
            ) {
              return;
            }

            let stringLiteral: t.StringLiteral;
            const { loc } = localPath.node;

            if (useRC4) {
              if (
                localPath.node.arguments.length !== 2 ||
                !t.isNumericLiteral(localPath.node.arguments[0]) ||
                !t.isStringLiteral(localPath.node.arguments[1])
              ) {
                return;
              }

              stringLiteral = t.stringLiteral(
                rc4(
                  localPath.node.arguments[0].value + offset,
                  localPath.node.arguments[1].value,
                  alphabet,
                  table
                )
              );
            } else {
              if (
                localPath.node.arguments.length !== 1 ||
                !t.isNumericLiteral(localPath.node.arguments[0])
              ) {
                return;
              }

              stringLiteral = t.stringLiteral(
                atobb(
                  table[
                    (table.length +
                      localPath.node.arguments[0].value +
                      offset) %
                      table.length
                  ],
                  alphabet
                )
              );
            }

            localPath.replaceWith(stringLiteral);
            localPath.node.loc = loc;
          },
          false
        );
      },
    };
  },
};
