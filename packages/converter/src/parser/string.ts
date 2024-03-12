export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function removeTrail(text: string) {
  return text.replace(/(?:\.|!|:|\?|,|;)+$/g, "");
}

export function normalizeWhitespaces(text: string) {
  return text.replace(/ +/g, " ");
}

export function addTrail(text: string, symbol: string = ".") {
  const lastCharIndex = text.length - 1;
  if (
    [".", "!", ":", "?", ",", ";"].includes(
      text.charAt(lastCharIndex),
    )
  )
    return text;
  return text + symbol;
}
