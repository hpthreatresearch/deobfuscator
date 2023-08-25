// https://www.codiga.io/blog/revisiting-codemirror-6-react-implementation/

import type { ViewUpdate } from "@codemirror/view";
import { EditorView } from "@codemirror/view";

export type OnChange = (viewUpdate: ViewUpdate) => void;

export function onUpdate(onChange: OnChange) {
  return EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    onChange(viewUpdate);
  });
}
