/**
 * Keeps two independently-scrolling panes (source + preview) loosely in
 * sync: whichever pane the user scrolls, we find the element nearest the
 * top of its viewport and scroll the other pane so its corresponding
 * element sits at the same fractional height.
 */

export interface TopVisible {
  index: number;
  /** Fraction of the container's viewport height the element's top sits at. */
  fraction: number;
}

export function getTopVisibleFraction(
  container: HTMLElement,
  children: ArrayLike<Element>
): TopVisible | null {
  if (children.length === 0) return null;
  const containerRect = container.getBoundingClientRect();
  for (let i = 0; i < children.length; i++) {
    const rect = children[i]!.getBoundingClientRect();
    if (rect.bottom - containerRect.top > 0) {
      return {
        index: i,
        fraction: (rect.top - containerRect.top) / container.clientHeight,
      };
    }
  }
  return { index: children.length - 1, fraction: 0 };
}

export function scrollElementIntoFraction(
  container: HTMLElement,
  el: Element,
  fraction: number
) {
  const containerRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const elTopInContent = container.scrollTop + (elRect.top - containerRect.top);
  container.scrollTop = elTopInContent - fraction * container.clientHeight;
}

/** Index of the last entry in a sorted array that is <= line, or 0. */
export function nearestBlockIndex(blockLines: number[], line: number): number {
  let lo = 0;
  let hi = blockLines.length - 1;
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (blockLines[mid]! <= line) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}
