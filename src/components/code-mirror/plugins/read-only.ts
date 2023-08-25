// © Copyright 2023 HP Development Company, L.P.
import { Compartment, EditorState } from "@codemirror/state";

/**
 * An extension to make the editor read only
 */
const readOnly = new Compartment();
export const readOnlyExtension = readOnly.of(EditorState.readOnly.of(true));
