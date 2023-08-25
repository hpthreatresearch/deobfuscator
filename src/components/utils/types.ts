// © Copyright 2023 HP Development Company, L.P.
export type DocumentPosition = { line: number; col: number };
export type DocumentRange = {
  from: DocumentPosition;
  to: DocumentPosition;
};
