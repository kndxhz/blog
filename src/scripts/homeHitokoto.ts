type JinrishiciResult = {
  data?: {
    content?: string;
    origin?: {
      dynasty?: string;
      author?: string;
      title?: string;
      content?: string[];
      translate?: string[];
    };
  };
};

type JinrishiciApi = {
  load: (
    onSuccess: (result: JinrishiciResult) => void,
    onError?: () => void,
  ) => void;
};

declare global {
  interface Window {
    jinrishici?: JinrishiciApi;
  }
}

function readText<T extends Element>(selector: string) {
  return document.querySelector<T>(selector);
}

function loadHomeHitokoto() {
  const content = readText<HTMLElement>("#hitokoto-content");
  const source = readText<HTMLElement>("#hitokoto-source");
  const detailOrigin = readText<HTMLElement>("#hitokoto-detail-origin");
  const detailContent = readText<HTMLPreElement>("#hitokoto-detail-content");
  const detailTranslate = readText<HTMLElement>("#hitokoto-detail-translate");

  if (!content || !source || !window.jinrishici) return;

  window.jinrishici.load(
    (result) => {
      const data = result.data;
      const origin = data?.origin;
      if (!data || !origin?.title || !origin?.author || !origin?.dynasty)
        return;

      content.textContent = data.content ?? "";
      source.textContent = `【${origin.dynasty}】${origin.author}《${origin.title}》`;
      if (detailOrigin) {
        detailOrigin.textContent = `【${origin.dynasty}】${origin.author}《${origin.title}》`;
      }
      if (detailContent) {
        detailContent.textContent =
          origin.content?.join("\n") ?? data.content ?? "";
      }
      if (detailTranslate) {
        detailTranslate.textContent = origin.translate?.length
          ? origin.translate.join("\n")
          : "暂无译文";
      }
    },
    () => {
      source.textContent = "今日诗词暂时不可用";
    },
  );
}

function initHitokotoDetail() {
  const trigger = document.querySelector<HTMLButtonElement>(".home-hitokoto");
  const detail = document.querySelector<HTMLElement>("#hitokoto-detail");
  if (!trigger || !detail || trigger.dataset.detailReady === "true") return;

  trigger.dataset.detailReady = "true";

  detail.hidden = true;
  detail.removeAttribute("data-state");
  detail.setAttribute("aria-hidden", "true");

  const toggleDetail = () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    if (expanded) {
      trigger.setAttribute("aria-expanded", "false");
      detail.dataset.state = "closing";
      detail.setAttribute("aria-hidden", "true");

      const onEnd = (event: TransitionEvent) => {
        if (event.target !== detail || event.propertyName !== "opacity") return;
        if (detail.dataset.state === "closing") {
          detail.hidden = true;
          detail.removeAttribute("data-state");
        }
        detail.removeEventListener("transitionend", onEnd);
      };

      detail.addEventListener("transitionend", onEnd);
      return;
    }

    trigger.setAttribute("aria-expanded", "true");
    detail.hidden = false;
    detail.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      detail.dataset.state = "open";
    });
  };

  trigger.addEventListener("click", toggleDetail);
}

export function initHomePage() {
  const boot = () => {
    if (window.jinrishici) {
      loadHomeHitokoto();
    } else {
      window.setTimeout(boot, 120);
      return;
    }

    initHitokotoDetail();
  };

  boot();
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomePage, { once: true });
  } else {
    initHomePage();
  }

  document.addEventListener("astro:page-load", initHomePage);
}
