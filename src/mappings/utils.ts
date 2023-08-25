// © Copyright 2023 HP Development Company, L.P.
import { base64VlqDecode } from "@lewistg/base64-vlq-codec";

export const convertMapping = (mappings: string): number[][] => {
  const tempMapping = mappings
    .split(";")
    .map((line) => line.split(",").map(base64VlqDecode));

  let lineNumber = undefined;
  let columnNumber = 0;

  let srcLine = 1;

  for (const line of tempMapping) {
    let srcCol = line.length > 0 ? line[0][0] : 0;
    for (const token of line) {
      if (lineNumber === undefined) {
        token[2]++;

        lineNumber = token[2];
        columnNumber = token[3];
      } else {
        srcCol += token[0];
        token[0] = srcCol;

        lineNumber += token[2];
        token[2] = lineNumber;

        columnNumber += token[3];
        token[3] = columnNumber;
      }
      token.unshift(srcLine);
    }
    srcLine++;
  }

  return tempMapping.flat();
};
