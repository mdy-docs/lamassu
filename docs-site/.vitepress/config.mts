import { defineConfig } from "vitepress";

// Deploys alongside the playground under https://mdy-docs.github.io/lamassu-js/
// (see .github/workflows/pages.yml, which builds this into web/dist/docs/ next
// to the playground build) — so assets must be served under that sub-path.
// Override for a local root preview: VITEPRESS_BASE=/ npm run docs:dev
const base = process.env.VITEPRESS_BASE ?? "/lamassu-js/docs/";

export default defineConfig({
  title: "lamassu-js",
  description:
    "A strict, safe JavaScript-subset engine written in C, compiled to WebAssembly — sandboxed evaluation for untrusted templates.",
  base,
  srcDir: ".",
  outDir: "dist",
  // NOT cleanUrls: GitHub Pages serves files literally with no server-side
  // rewrite support, so internal links must keep the .html extension that
  // matches what's actually on disk.
  lastUpdated: true,

  head: [["link", { rel: "icon", href: `${base}favicon.svg` }]],

  themeConfig: {
    logo: "/favicon.svg",

    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "API Reference", link: "/api/" },
      { text: "Playground", link: "https://mdy-docs.github.io/lamassu-js/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [{ text: "What is lamassu-js?", link: "/guide/" }],
        },
        {
          text: "The language",
          items: [
            { text: "Supported syntax", link: "/guide/language" },
            { text: "Built-ins", link: "/guide/builtins" },
            { text: "Async & host calls", link: "/guide/async" },
            { text: "Deviations from real JS", link: "/guide/deviations" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "npm package", link: "/api/npm-package" },
            { text: "C embedding API", link: "/api/c-embedding" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/mdy-docs/lamassu-js" },
      { icon: "npm", link: "https://www.npmjs.com/package/@mdy-docs/lamassu-js" },
    ],

    search: { provider: "local" },

    editLink: {
      pattern: "https://github.com/mdy-docs/lamassu-js/edit/main/docs-site/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © lamassu-js contributors",
    },
  },
});
