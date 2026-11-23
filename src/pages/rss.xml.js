import { getCollection, render } from "astro:content";
import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

const SITE_LANGUAGE = "zh-CN";
const CONTENT_NAMESPACE = "http://purl.org/rss/1.0/modules/content/";
const ATOM_NAMESPACE = "http://www.w3.org/2005/Atom";

function rewriteUrls(html, baseUrl) {
  const absolute = (value) => {
    try {
      return new URL(value, baseUrl).href;
    } catch {
      return value;
    }
  };

  return html
    .replace(
      /\s(href|src|poster|cite)=(["'])(.*?)\2/g,
      (match, attribute, quote, value) => {
        if (
          !value ||
          value.startsWith("#") ||
          value.startsWith("//") ||
          /^[a-z][a-z0-9+.-]*:/i.test(value)
        ) {
          return match;
        }
        return ` ${attribute}=${quote}${absolute(value)}${quote}`;
      },
    )
    .replace(/\ssrcset=(["'])(.*?)\1/g, (match, quote, value) => {
      const candidates = value
        .split(",")
        .map((candidate) => {
          const [url, ...descriptor] = candidate.trim().split(/\s+/);
          return [absolute(url), ...descriptor].join(" ");
        })
        .join(", ");
      return ` srcset=${quote}${candidates}${quote}`;
    });
}

/**
 * RSS readers load the feed outside of the site, so every relative URL in the
 * rendered article HTML has to be turned into an absolute one. Code samples
 * are kept untouched so that their contents stay literal.
 */
function absolutizeHtml(html, baseUrl) {
  const codeBlocks = [];
  const withoutCode = html.replace(
    /<(pre|code|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
    (block) => {
      codeBlocks.push(block);
      return `\u0000${codeBlocks.length - 1}\u0000`;
    },
  );

  return rewriteUrls(withoutCode, baseUrl).replace(
    /\u0000(\d+)\u0000/g,
    (_, index) => codeBlocks[Number(index)],
  );
}

export async function GET(context) {
  const site = new URL(context.site);
  const feedUrl = new URL("rss.xml", site).href;

  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const container = await AstroContainer.create({
    astroConfig: { site },
  });

  const items = [];
  for (const post of posts) {
    const { Content } = await render(post);
    const postUrl = new URL(`/blog/${post.id}/`, site);
    const content = absolutizeHtml(
      await container.renderToString(Content),
      postUrl,
    );

    items.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl.pathname,
      // @astrojs/rss serializes this as <content:encoded>, which RSS readers
      // use to display the whole article instead of only the excerpt.
      content,
      categories: post.data.tags,
      ...(post.data.updatedDate && {
        customData: `<atom:updated>${post.data.updatedDate.toISOString()}</atom:updated>`,
      }),
    });
  }

  const lastBuildDate = posts.reduce(
    (latest, post) => {
      const date = post.data.updatedDate ?? post.data.pubDate;
      return date > latest ? date : latest;
    },
    new Date(posts[0]?.data.pubDate ?? Date.now()),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items,
    trailingSlash: true,
    xmlns: {
      atom: ATOM_NAMESPACE,
      content: CONTENT_NAMESPACE,
    },
    customData: [
      `<language>${SITE_LANGUAGE}</language>`,
      `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
      "<generator>Astro</generator>",
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    ].join(""),
  });
}
