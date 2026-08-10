import mediumZoom from "medium-zoom";

const zoom = mediumZoom({
  background: "rgba(0, 0, 0, 0.84)",
  margin: 24,
});

export function initArticleImageZoom() {
  zoom.detach();
  zoom.attach(
    document.querySelectorAll<HTMLImageElement>(
      ".prose img:not([data-no-zoom])",
    ),
  );
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
