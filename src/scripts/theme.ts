const STORAGE_KEY = "theme-preference";
type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ||
      document.documentElement.dataset.theme === "light"
    ? (document.documentElement.dataset.theme as Theme)
    : getSystemTheme();
}

function updateToggle(toggle: HTMLButtonElement) {
  const theme = getTheme();
  toggle.setAttribute(
    "aria-label",
    theme === "dark" ? "切换到浅色模式" : "切换到深色模式",
  );
  toggle.setAttribute("title", theme === "dark" ? "浅色模式" : "深色模式");
}

export function initTheme() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (!toggle || toggle.dataset.themeReady === "true") return;

  toggle.dataset.themeReady = "true";
  updateToggle(toggle);

  toggle.addEventListener("click", () => {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    updateToggle(toggle);
    toggle.classList.remove("is-switching");
    void toggle.offsetWidth;
    toggle.classList.add("is-switching");
  });

  toggle.addEventListener("animationend", () => {
    toggle.classList.remove("is-switching");
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!window.localStorage.getItem(STORAGE_KEY)) updateToggle(toggle);
    });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme, { once: true });
  } else {
    initTheme();
  }

  document.addEventListener("astro:page-load", initTheme);
}
