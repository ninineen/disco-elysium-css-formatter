/**
 * Copy text using the modern Clipboard API when available, with a fallback for
 * browsers that deny clipboard permissions or do not expose that API.
 */
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Some browsers expose the API but reject its permission request.
    }
  }

  return copyWithSelection(text);
}

function copyWithSelection(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.append(textarea);
  textarea.select();
  const didCopy = document.execCommand("copy");
  textarea.remove();

  return didCopy;
}