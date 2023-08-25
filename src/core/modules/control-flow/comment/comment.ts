// © Copyright 2023 HP Development Company, L.P.
import type { ControlFlowModule } from "../../../types";
import { CommentView } from "./CommentView";
import documentation from "./comment.md";

export const comment: ControlFlowModule = {
  documentation,
  kind: "controlFlow",
  ModuleComponent: CommentView,
  operation: () => 0,
  steps: () => 0,
};
