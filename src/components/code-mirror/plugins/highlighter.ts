// © Copyright 2023 HP Development Company, L.P.
import {
  Prec,
  RangeSetBuilder,
  StateEffect,
  StateField,
} from "@codemirror/state";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin } from "@codemirror/view";
import { EditorView } from "codemirror";
import type { DocumentRange } from "../../utils/types";
import type { VerticalSlice } from "./scroll-bar";
import { getVerticalSlice } from "./scroll-bar";

export class ExtSelectionState {
  constructor(readonly ranges: DocumentRange[]) {}
}

export const setExtSelection = StateEffect.define<ExtSelectionState>();

const extSelectionState: StateField<ExtSelectionState> =
  StateField.define<ExtSelectionState>({
    create() {
      return new ExtSelectionState([]);
    },
    update(value, tr) {
      for (const effect of tr.effects) {
        if (effect.is(setExtSelection)) {
          value = new ExtSelectionState(effect.value.ranges);
        }
      }
      return value;
    },
  });

const matchMark = Decoration.mark({ class: "cm-selection" });

const extSelectionHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    scrollBar: HTMLElement;
    previousState: ExtSelectionState;

    constructor(readonly view: EditorView) {
      this.decorations = this.highlight(
        view,
        view.state.field(extSelectionState)
      );

      this.scrollBar = document.createElement("div");

      this.previousState = new ExtSelectionState([]);
    }

    update(update: ViewUpdate) {
      const state = update.state.field(extSelectionState);
      if (state && state !== this.previousState) {
        this.previousState = state;
        this.decorations = this.highlight(update.view, state);
      }
    }

    highlight(view: EditorView, { ranges }: ExtSelectionState) {
      if (!ranges) return Decoration.none;
      const builder = new RangeSetBuilder<Decoration>();

      // TODO: use a custom datatype
      const verticalSlices: VerticalSlice[] = [];

      for (const range of ranges) {
        const start =
          view.state.doc.line(range.from.line).from + range.from.col;

        const end = view.state.doc.line(range.to.line).from + range.to.col;

        builder.add(start, end, matchMark);

        // Force an entire render
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (view as any).observer.onPrint();

        const slice = getVerticalSlice(view.contentDOM, start, end);
        slice && verticalSlices.push(slice);
      }

      const slices: HTMLElement[] = [];
      const scaling = Math.min(
        1,
        view.dom.getBoundingClientRect().height /
          view.contentDOM.getBoundingClientRect().height
      );
      for (const verticalSlice of verticalSlices) {
        const e: HTMLDivElement = document.createElement("div");
        e.style.cssText = `
        right: 1px;
        position: absolute;
        top: ${Math.floor(
          scaling *
            (verticalSlice.y - view.contentDOM.getBoundingClientRect().y)
        )}px;
        height: ${Math.max(8, Math.floor(scaling * verticalSlice.height))}px;
        width: 8px;
        border-radius: 4px;

        background: #FBB917aa;
        `;
        slices.push(e);
      }

      if (
        view.dom.parentElement &&
        !view.dom.parentElement.contains(this.scrollBar)
      ) {
        view.dom.parentElement.appendChild(this.scrollBar);
      }

      this.scrollBar?.replaceChildren(...slices);

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

const baseTheme = EditorView.baseTheme({
  ".cm-selection": { backgroundColor: "#ffff00" },
});

export const extSelectionExtension = [
  extSelectionState,
  Prec.lowest(extSelectionHighlighter),
  baseTheme,
];
