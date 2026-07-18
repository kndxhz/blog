const STORAGE_KEY = "sidebar-collapsed";

function setCollapsed(collapsed: boolean) {
  document.documentElement.classList.toggle("sidebar-collapsed", collapsed);
}

function animateSidebarChange() {
  document.documentElement.classList.add("sidebar-animating");
  window.setTimeout(() => {
    document.documentElement.classList.remove("sidebar-animating");
  }, 320);
}

export function initSidebar() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-sidebar-toggle]");
  if (!toggle || toggle.dataset.sidebarReady === "true") return;

  toggle.dataset.sidebarReady = "true";

  const stored = window.localStorage.getItem(STORAGE_KEY) === "1";
  setCollapsed(stored);
  toggle.setAttribute("aria-expanded", String(!stored));
  toggle.setAttribute(
    "aria-label",
    stored ? "展开侧边栏" : "收起侧边栏",
  );

  toggle.addEventListener("click", () => {
    const collapsed = !document.documentElement.classList.contains("sidebar-collapsed");
    animateSidebarChange();
    setCollapsed(collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute(
      "aria-label",
      collapsed ? "展开侧边栏" : "收起侧边栏",
    );
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebar, { once: true });
  } else {
    initSidebar();
  }

  document.addEventListener("astro:page-load", initSidebar);
}
