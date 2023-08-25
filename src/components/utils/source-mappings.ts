// © Copyright 2023 HP Development Company, L.P.
import type { DocumentPosition } from "./types";

interface SourcePosition {
  line: number;
  column: number;
}

export type Mapping = { src: SourcePosition[]; dest: SourcePosition };

export const deCodeMapping = (mappings: number[][][]): Mapping[] => {
  const ret: Mapping[] = [];

  let srcLine = 0,
    srcCol = 0,
    destLine = 1;
  // FIXME: last token
  for (const line of mappings) {
    let destCol = 0;
    for (const token of line) {
      destCol = token[0] += destCol;
      srcLine = token[2] += srcLine;
      srcCol = token[3] += srcCol;
      token.unshift(destLine);
    }
    destLine++;
  }

  for (const e of mappings.flat()) {
    const mapping: Mapping = { src: [], dest: { line: e[0], column: e[1] } };

    if (e[4] < 0) {
      // mapping.src = decodeLocations(e[3], e[4])
    } else {
      mapping.src = [{ line: e[3], column: e[4] }];
    }
    ret.push(mapping);
  }

  return ret;
};

export const getObfPositionOfMapping = (
  mappings: number[][],
  documentPosition: DocumentPosition,
  goingTo = false
): DocumentPosition => {
  const newPosition: DocumentPosition = { line: 1, col: 0 };

  const { line, col } = documentPosition;

  for (const [srcLine, srcCol, , newLine, newCol] of mappings) {
    if (srcLine < line && srcCol < col) {
      continue;
    }

    if ((srcLine === line && srcCol > col) || srcLine > line) {
      if (goingTo) {
        goingTo = false;
      } else {
        break;
      }
    }

    newPosition.line = newLine;
    newPosition.col = newCol;
  }

  return newPosition;
};
