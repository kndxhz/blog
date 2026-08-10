const RESET_DELAY = 1600;

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function setButtonState(button: HTMLButtonElement, copied: boolean) {
  button.dataset.copied = String(copied);
  button.setAttribute("aria-label", copied ? "代码已复制" : "复制代码");
  button.setAttribute("title", copied ? "已复制" : "复制代码");
}

export function initCodeBlockCopy() {
  document.querySelectorAll<HTMLPreElement>(".prose pre").forEach((pre) => {
    if (pre.dataset.copyReady === "true") return;

    const code = pre.querySelector("code");
    if (!code?.textContent) return;

    pre.dataset.copyReady = "true";
    pre.classList.add("code-copy-wrap");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    setButtonState(button, false);

    button.addEventListener("click", async () => {
      try {
        await copyText(code.textContent ?? "");
        setButtonState(button, true);
        window.setTimeout(() => setButtonState(button, false), RESET_DELAY);
      } catch {
        button.setAttribute("aria-label", "复制代码失败");
        button.setAttribute("title", "复制失败");
        window.setTimeout(() => setButtonState(button, false), RESET_DELAY);
      }
    });

    pre.append(button);
  });
}

if (typeof window !== "undefined") {
  document.addEventListener("astro:page-load", initCodeBlockCopy);
}
