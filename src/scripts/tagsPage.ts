function readSelectedTags() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("tags") || "";
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function writeSelectedTags(tags: string[]) {
  const params = new URLSearchParams(window.location.search);
  if (tags.length > 0) {
    params.set("tags", tags.join(","));
  } else {
    params.delete("tags");
  }

  const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  window.history.replaceState({}, "", nextUrl);
}

function getItems<T extends Element>(root: ParentNode, selector: string) {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function initTagsPage() {
  const filtersEl = document.getElementById("tag-filters");
  const postsEl = document.getElementById("post-list");
  const summaryEl = document.getElementById("tag-summary");
  const emptyEl = document.getElementById("empty-state");
  const clearBtn = document.getElementById("clear-filters");

  if (!filtersEl || !postsEl || filtersEl.dataset.tagsReady === "true") return;

  filtersEl.dataset.tagsReady = "true";

  const render = () => {
    const selected = new Set(readSelectedTags());
    const chips = getItems<HTMLElement>(filtersEl, "[data-tag]");
    const items = getItems<HTMLElement>(postsEl, "[data-tags]");
    let visibleCount = 0;

    chips.forEach((chip) => {
      chip.classList.toggle("active", selected.has(chip.dataset.tag || ""));
    });

    items.forEach((item) => {
      const itemTags = (item.getAttribute("data-tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const visible =
        selected.size === 0 ||
        [...selected].every((tag) => itemTags.includes(tag));
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (summaryEl) {
      summaryEl.textContent =
        selected.size === 0
          ? `共 ${items.length} 篇文章。`
          : `已选 ${selected.size} 个标签，显示 ${visibleCount} 篇文章。`;
    }

    if (emptyEl) {
      emptyEl.hidden = visibleCount !== 0;
    }
  };

  const toggleTag = (tag: string) => {
    const selected = new Set(readSelectedTags());
    if (selected.has(tag)) {
      selected.delete(tag);
    } else {
      selected.add(tag);
    }
    writeSelectedTags([...selected]);
    render();
  };

  filtersEl.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLElement>("[data-tag]");
    if (!button?.dataset.tag) return;
    toggleTag(button.dataset.tag);
  });

  clearBtn?.addEventListener("click", () => {
    writeSelectedTags([]);
    render();
  });

  render();
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTagsPage, { once: true });
  } else {
    initTagsPage();
  }

  document.addEventListener("astro:page-load", initTagsPage);
}
