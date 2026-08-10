import hljs from "highlight.js/lib/common";

function normalizeLanguage(code: HTMLElement) {
  const languageClass = [...code.classList].find((className) =>
    className.startsWith("language-"),
  );
  if (!languageClass) return;

  const language = languageClass.slice("language-".length);
  if (language === "plain" || language === "plaintext" || language === "text") {
    code.classList.add("language-plaintext");
    return;
  }

  if (hljs.getLanguage(language)) return;
  code.classList.remove(languageClass);
}

export function initCodeHighlight() {
  document.querySelectorAll<HTMLElement>(".prose pre code").forEach((code) => {
    if (code.dataset.highlightReady === "true") return;

    normalizeLanguage(code);
    hljs.highlightElement(code);
    code.dataset.highlightReady = "true";
  });
}

if (typeof window !== "undefined") {
  document.addEventListener("astro:page-load", initCodeHighlight);
}
