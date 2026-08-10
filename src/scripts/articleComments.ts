import Artalk from "artalk";
import "artalk/Artalk.css";

const SERVER = "https://artalk.kndxhz.cn/";
const SITE = "小伙纸的杂货间";

interface CommentsState {
  comments?: ReturnType<typeof Artalk.init>;
  initTimer?: number;
  observer?: MutationObserver;
  themeObserver?: MutationObserver;
  colorSchemeQuery?: MediaQueryList;
  colorSchemeListener?: () => void;
}

declare global {
  interface Window {
    articleCommentsState?: CommentsState;
  }
}

function getState() {
  window.articleCommentsState ??= {};
  return window.articleCommentsState;
}

export function destroyArticleComments() {
  const state = getState();
  window.clearTimeout(state.initTimer);
  state.observer?.disconnect();
  state.observer = undefined;
  state.themeObserver?.disconnect();
  state.themeObserver = undefined;
  if (state.colorSchemeQuery && state.colorSchemeListener) {
    state.colorSchemeQuery.removeEventListener(
      "change",
      state.colorSchemeListener,
    );
  }
  state.colorSchemeQuery = undefined;
  state.colorSchemeListener = undefined;
  state.comments?.destroy();
  state.comments = undefined;
}

function isDarkTheme() {
  const theme = document.documentElement.dataset.theme;
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function syncArtalkTheme() {
  getState().comments?.setDarkMode(isDarkTheme());
}

function watchThemeChanges() {
  const state = getState();
  state.themeObserver?.disconnect();
  state.themeObserver = new MutationObserver(syncArtalkTheme);
  state.themeObserver.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });

  if (state.colorSchemeQuery && state.colorSchemeListener) {
    state.colorSchemeQuery.removeEventListener(
      "change",
      state.colorSchemeListener,
    );
  }
  state.colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  state.colorSchemeListener = syncArtalkTheme;
  state.colorSchemeQuery.addEventListener("change", state.colorSchemeListener);
}

function patchArtalkAccessibility(el: HTMLElement) {
  el.querySelectorAll<HTMLElement>("i[aria-label]").forEach((icon) => {
    if (!icon.getAttribute("role")) icon.setAttribute("role", "button");
    if (!icon.getAttribute("tabindex")) icon.setAttribute("tabindex", "0");
  });
}

export function initArticleComments() {
  const state = getState();
  window.clearTimeout(state.initTimer);
  state.initTimer = window.setTimeout(() => {
    const el = document.querySelector<HTMLElement>("[data-artalk-comments]");
    if (!el) return;

    state.comments?.destroy();
    state.comments = undefined;
    el.replaceChildren();
    state.comments = Artalk.init({
      el,
      pageKey: el.dataset.pageKey || window.location.pathname,
      pageTitle: el.dataset.pageTitle || document.title,
      server: SERVER,
      site: SITE,
      darkMode: isDarkTheme(),
    });
    syncArtalkTheme();
    watchThemeChanges();
    patchArtalkAccessibility(el);
    state.observer = new MutationObserver(() => patchArtalkAccessibility(el));
    state.observer.observe(el, { childList: true, subtree: true });
  }, 0);
}

if (typeof window !== "undefined") {
  document.addEventListener("astro:before-swap", destroyArticleComments);
  document.addEventListener("astro:page-load", initArticleComments);
}
