const STORAGE_KEY = "theme-preference";
type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function isTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark";
}

function getStoredPreference(): ThemePreference {
  const preference = window.localStorage.getItem(STORAGE_KEY);
  return preference === "light" ||
    preference === "dark" ||
    preference === "system"
    ? preference
    : "system";
}

function getPreference(): ThemePreference {
  const preference = document.documentElement.dataset.themePreference;
  return preference === "light" ||
    preference === "dark" ||
    preference === "system"
    ? preference
    : getStoredPreference();
}

function getTheme(): Theme {
  return isTheme(document.documentElement.dataset.theme)
    ? document.documentElement.dataset.theme
    : getSystemTheme();
}

function applyTheme(preference: ThemePreference) {
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme =
    preference === "system" ? getSystemTheme() : preference;
}

function updateToggle(toggle: HTMLButtonElement) {
  const preference = getPreference();
  const theme = getTheme();
  const label =
    preference === "system"
      ? `跟随系统（当前${theme === "dark" ? "深色" : "浅色"}）`
      : theme === "dark"
        ? "深色模式"
        : "浅色模式";
  toggle.setAttribute("aria-label", `${label}，点击切换主题`);
  toggle.setAttribute("title", label);
}

export function initTheme() {
  const toggle = document.querySelector<HTMLButtonElement>(
    "[data-theme-toggle]",
  );
  if (!toggle || toggle.dataset.themeReady === "true") return;

  toggle.dataset.themeReady = "true";
  applyTheme(getStoredPreference());
  updateToggle(toggle);

  toggle.addEventListener("click", () => {
    const preference = getPreference();
    const nextPreference: ThemePreference =
      preference === "light"
        ? "dark"
        : preference === "dark"
          ? "system"
          : "light";
    applyTheme(nextPreference);
    window.localStorage.setItem(STORAGE_KEY, nextPreference);
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
      if (getPreference() === "system") applyTheme("system");
      updateToggle(toggle);
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
