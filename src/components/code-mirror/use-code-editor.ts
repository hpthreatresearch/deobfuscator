// https://www.codiga.io/blog/revisiting-codemirror-6-react-implementation/

import type { Extension } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { useEffect, useState } from "react";
import type { OnChange } from "./on-update";
import { onUpdate } from "./on-update";
import { useCodeMirror } from "./use-code-mirror";

export function useCodeEditor(props: {
  onChange?: OnChange;
  extensions?: Extension[];
  defaultCode?: string;
}) {
  const [code, setCode] = useState(
    props.defaultCode || `console.log("Hello, World!");\n`
  );

  const onChange = (update: ViewUpdate) => {
    if (update.docChanged) {
      const doc = update.state.doc;
      const value = doc.toString();
      setCode(value);
    }

    props.onChange && props.onChange(update);
  };

  const { ref, view } = useCodeMirror([
    onUpdate(onChange),
    ...(props.extensions || []),
  ]);

  useEffect(() => {
    if (view) {
      const editorValue = view.state.doc.toString();

      if (code !== editorValue) {
        view.dispatch({
          changes: {
            from: 0,
            to: editorValue.length,
            insert: code || "",
          },
        });
      }
    }
  }, [code, view]);

  return { ref, view, code, setCode };
}
