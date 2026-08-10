// @ts-check,

import mdx from "@astrojs/mdx";
import { remarkMdFormat } from "@cavillxu/astro-md-format";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

function rehypePrioritizeFirstImage() {
  return (tree) => {
    let firstImage;

    function visit(node) {
      if (firstImage || !node || typeof node !== "object") return;
      if (node.type === "element" && node.tagName === "img") {
        firstImage = node;
        return;
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    }

    visit(tree);

    if (!firstImage) return;
    firstImage.properties ??= {};
    firstImage.properties.loading = "eager";
    firstImage.properties.fetchpriority = "high";
    firstImage.properties.decoding = "async";
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://blog.kndxhz.cn",
  build: {
    inlineStylesheets: "always",
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMdFormat],
      rehypePlugins: [rehypePrioritizeFirstImage],
    }),
  },
  integrations: [mdx(), sitemap()],
});
