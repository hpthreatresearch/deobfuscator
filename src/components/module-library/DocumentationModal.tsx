// © Copyright 2023 HP Development Company, L.P.
import { Compartment, EditorState } from "@codemirror/state";
import { MODULE_LIBRARIES, MODULE_LIBRARY_NAME } from "@core/config";
import { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import type { CodeComponent, CodeProps } from "react-markdown/lib/ast-to-react";
import type { MODULE_NAMES as MODULE_NAME } from "../../core/config/module-names";
import { MODULES } from "../../core/config/modules";
import { useCodeEditor } from "../code-mirror/use-code-editor";
import "./DocumentationModal.css";

export interface DocumentationModalProps {
  moduleName: MODULE_NAME;
}

/**
 * Syntax highlighting for JS codeblocks inside of markdown
 */
const CodeBlock: CodeComponent = ({
  inline,
  className,
  children,
  ...props
}: CodeProps) => {
  const match = /language-js/.exec(className || "");

  const readOnly = new Compartment();

  const { ref, setCode } = useCodeEditor({
    extensions: [readOnly.of(EditorState.readOnly.of(true))],
  });

  useEffect(() => {
    setCode(String(children).slice(0, -1));
  }, [children]);

  return !inline && match ? (
    <div ref={ref}></div>
  ) : (
    <code {...props} className={className}>
      {children}
    </code>
  );
};

/**
 * Modal contents to display the documentation of a given module
 */
export const DocumentationModal = ({ moduleName }: DocumentationModalProps) => {
  const { documentation } = MODULES[moduleName];

  const library = useMemo(
    () =>
      Object.values(MODULE_LIBRARY_NAME)
        .filter(
          (libName) =>
            MODULE_LIBRARIES[libName].modules.indexOf(moduleName) >= 0
        )
        .map((libName) => MODULE_LIBRARIES[libName].name)[0],
    [moduleName]
  );

  return (
    <>
      <Modal.Header closeButton>
        {library}
        {" > "}
        {moduleName}
      </Modal.Header>
      <Modal.Body>
        <ReactMarkdown
          className="documentation-md"
          components={{ code: CodeBlock }}
        >
          {documentation || "# No documentation available"}
        </ReactMarkdown>
      </Modal.Body>
    </>
  );
};
