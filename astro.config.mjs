// @ts-check,

import mdx from "@astrojs/mdx";
import { remarkMdFormat } from "@cavillxu/astro-md-format";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMdFormat],
    }),
  },
  integrations: [mdx(), sitemap()],
});
