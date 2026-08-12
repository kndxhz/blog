const coarsePointerQuery = window.matchMedia(
  "(hover: none), (pointer: coarse)",
);

function isInternalNavigableLink(link: HTMLAnchorElement) {
  if (!link.href || link.target || link.hasAttribute("download")) return false;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  return (
    url.pathname !== window.location.pathname ||
    url.search !== window.location.search
  );
}

function syncMobileNavigation() {
  document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    if (!isInternalNavigableLink(link)) return;

    if (coarsePointerQuery.matches) {
      link.dataset.astroReload = "";
    } else {
      delete link.dataset.astroReload;
    }
  });
}

syncMobileNavigation();
coarsePointerQuery.addEventListener("change", syncMobileNavigation);
document.addEventListener("astro:page-load", syncMobileNavigation);
