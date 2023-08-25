// © Copyright 2023 HP Development Company, L.P.
export interface VerticalSlice {
  y: number;
  height: number;
}

export function getVerticalSlice(
  parentElement: Node,
  start: number,
  end: number
): VerticalSlice | null {
  function getChild(node: Node): Text {
    return node.childNodes.length > 0
      ? getChild(node.childNodes[0])
      : (node as Text);
  }

  function nextNode(node: Node): Text | null {
    let ret = node.nextSibling;
    if (!ret) {
      if (node.parentNode && !node.parentNode.isEqualNode(parentElement)) {
        ret = nextNode(node.parentNode);
        if (!ret) return null;
      } else {
        return null;
      }
    }
    return getChild(ret);
  }

  let startNode = getChild(parentElement);
  while (start > startNode.length) {
    start -= startNode.length;
    const next = nextNode(startNode);
    if (!next) return null;
    startNode = next;
  }

  let endNode = getChild(parentElement);
  while (end > endNode.length) {
    end -= endNode.length;
    const next = nextNode(endNode);
    if (!next) return null;
    endNode = next;
  }

  const range = document.createRange();
  range.setStart(startNode, start);
  range.setEnd(endNode, end);
  const rect = range.getBoundingClientRect();
  return rect;
}
