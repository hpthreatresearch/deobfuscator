// https://www.codiga.io/blog/revisiting-codemirror-6-react-implementation/

import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import {
  highlightSelectionMatches,
  search,
  searchKeymap,
} from "@codemirror/search";
import type { Extension } from "@codemirror/state";
import { drawSelection, keymap, lineNumbers } from "@codemirror/view";
import { EditorView, minimalSetup } from "codemirror";
import { useEffect, useRef, useState } from "react";

export function useCodeMirror(extensions: Extension[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView>();

  const fixedHeightEditor = EditorView.theme({
    "&": { height: "100%", "max-height": "100%", position: "relative" },
    ".cm-scroller": { overflow: "auto" },
  });

  useEffect(() => {
    const view = new EditorView({
      extensions: [
        lineNumbers(),
        EditorView.lineWrapping,
        highlightSelectionMatches(),
        drawSelection(),
        minimalSetup,
        javascript({
          jsx: true,
          typescript: true,
        }),
        keymap.of([...defaultKeymap, ...searchKeymap, indentWithTab]),
        search(),
        fixedHeightEditor,

        ...extensions,
      ],
      parent: ref.current || undefined,
    });

    setView(view);

    return () => {
      view.destroy();
      setView(undefined);
    };
    // We only want to run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, view };
}
