import mediumZoom from "medium-zoom";

const zoom = mediumZoom({
  background: "rgba(0, 0, 0, 0.84)",
  margin: 24,
});

let initTimer: number | undefined;

export function initArticleImageZoom() {
  window.clearTimeout(initTimer);
  initTimer = window.setTimeout(() => {
    void zoom.close();
    zoom.detach();
    zoom.attach(
      document.querySelectorAll<HTMLImageElement>(
        ".prose img:not([data-no-zoom])",
      ),
    );
  }, 0);
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initArticleImageZoom, {
      once: true,
    });
  } else {
    initArticleImageZoom();
  }

  document.addEventListener("astro:page-load", initArticleImageZoom);
}
