import Artalk from "artalk";
import "artalk/Artalk.css";

const SERVER = "https://artalk.kndxhz.cn/";
const SITE = "小伙纸的杂货间";

interface CommentsState {
  comments?: ReturnType<typeof Artalk.init>;
  initTimer?: number;
  observer?: MutationObserver;
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
  state.comments?.destroy();
  state.comments = undefined;
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
    });
    patchArtalkAccessibility(el);
    state.observer = new MutationObserver(() => patchArtalkAccessibility(el));
    state.observer.observe(el, { childList: true, subtree: true });
  }, 0);
}

if (typeof window !== "undefined") {
  document.addEventListener("astro:before-swap", destroyArticleComments);
  document.addEventListener("astro:page-load", initArticleComments);
}
