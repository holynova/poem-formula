import fs from "node:fs";
import { marked } from "marked";

const sourcePath = new URL("./意象的帝国_写诗方法论.md", import.meta.url);
const outputPath = new URL("./index.html", import.meta.url);
const markdown = fs.readFileSync(sourcePath, "utf8");
const repositoryUrl = "https://github.com/holynova/poem-formula";

function stripInlineMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

function collectOutline(source) {
  const items = [];
  let inFence = false;
  let sectionIndex = 0;
  for (const line of source.split("\n")) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;
    sectionIndex += 1;
    items.push({
      depth: match[1].length,
      text: stripInlineMarkdown(match[2]),
      id: `section-${sectionIndex}`,
    });
  }
  return items;
}

const outline = collectOutline(markdown);
let renderedHeadingIndex = 0;

const renderer = {
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    if (depth === 1) return `<h1>${text}</h1>`;
    renderedHeadingIndex += 1;
    return `<h${depth} id="section-${renderedHeadingIndex}" tabindex="-1">${text}</h${depth}>`;
  },
  image({ href, title, text }) {
    const safeTitle = title ? ` title="${title}"` : "";
    const assetUrl = new URL(href, import.meta.url);
    const imageData = fs.readFileSync(assetUrl).toString("base64");
    const embeddedSource = `data:image/png;base64,${imageData}`;
    return `<figure class="article-figure"><img src="${embeddedSource}" alt="${text}" width="1672" height="941" loading="lazy"${safeTitle}><figcaption>${text}</figcaption></figure>`;
  },
};

marked.use({ renderer, gfm: true, breaks: false });
const articleHtml = marked.parse(markdown);
const unresolvedBoldMarkers = articleHtml.match(/\*\*[^*]+\*\*/g) ?? [];
if (unresolvedBoldMarkers.length) {
  throw new Error(`未渲染的 Markdown 加粗标记：${unresolvedBoldMarkers.join(", ")}`);
}
const title = stripInlineMarkdown(markdown.match(/^#\s+(.+)$/m)?.[1] ?? "意象的帝国：写诗方法论");

const desktopToc = outline
  .map(
    ({ depth, text, id }) =>
      `<a class="toc-link toc-depth-${depth}" href="#${id}" data-section="${id}">${text}</a>`,
  )
  .join("\n");

const mobileToc = outline
  .filter(({ depth }) => depth === 2)
  .map(({ text, id }) => `<a href="#${id}">${text}</a>`)
  .join("\n");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="从《意象的帝国》中提炼以错配为核心的现代诗写作方法，包括四种公式、关联校准、意象平衡与整诗结构。">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <script
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id="e01c9f78-4607-4e60-b01c-77c8190b12b4"
    data-domains="holynova.github.io"
    data-exclude-search="true"
    data-exclude-hash="true"
  ></script>
  <style>
    :root {
      --canvas: oklch(96.8% 0.009 78);
      --paper: oklch(99.7% 0.003 75);
      --ink: oklch(22% 0.015 58);
      --muted: oklch(49% 0.018 62);
      --faint: oklch(55% 0.014 68);
      --line: oklch(87% 0.013 72);
      --accent: oklch(53% 0.17 25);
      --accent-soft: oklch(94% 0.035 25);
            --code: oklch(95.3% 0.012 70);
      --serif: "Songti SC", "Noto Serif SC", STSong, SimSun, serif;
      --sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
      --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      --content: 720px;
      --radius-sm: 6px;
      --radius-md: 12px;
      --radius-lg: 20px;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; scroll-padding-top: 40px; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--canvas);
      font-family: var(--serif);
      font-size: 18px;
      line-height: 1.84;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    a { color: inherit; }
    button { font: inherit; }
    .skip-link {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 100;
      padding: 8px 12px;
      color: var(--paper);
      background: var(--ink);
      border-radius: var(--radius-sm);
      font-family: var(--sans);
      font-size: 13px;
      transform: translateY(-160%);
      transition: transform 160ms ease-out;
    }
    .skip-link:focus { transform: translateY(0); }
    .progress {
      position: fixed;
      inset: 0 0 auto;
      z-index: 90;
      height: 3px;
      background: transparent;
    }
    .progress span {
      display: block;
      width: 100%;
      height: 100%;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left center;
    }

    .masthead {
      padding: 70px 32px 54px;
      color: var(--paper);
      background: var(--ink);
    }
    .masthead-inner {
      width: min(1120px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 250px;
      gap: 64px;
      align-items: end;
    }
    .eyebrow {
      margin: 0 0 18px;
      color: oklch(78% 0.05 25);
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 650;
      letter-spacing: .14em;
    }
    .masthead h1 {
      max-width: 820px;
      margin: 0;
      font-family: var(--serif);
      font-size: clamp(38px, 5vw, 68px);
      font-weight: 700;
      line-height: 1.16;
      text-wrap: balance;
    }
    .masthead-side { padding-bottom: 6px; }
    .masthead-meta {
      padding-bottom: 6px;
      font-family: var(--sans);
      font-size: 13px;
      line-height: 1.7;
      color: oklch(78% 0.01 70);
    }
    .masthead-meta strong {
      display: block;
      color: var(--paper);
      font-size: 26px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .masthead-links { margin: 16px 0 0; }
    .masthead-links a {
      display: inline-flex;
      min-height: 38px;
      align-items: center;
      padding: 7px 10px;
      color: oklch(92% 0.015 70);
      border: 1px solid oklch(92% 0.015 70 / .28);
      border-radius: var(--radius-sm);
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition-property: color, background-color, transform;
      transition-duration: 150ms;
      transition-timing-function: ease-out;
    }
    @media (hover: hover) {
      .masthead-links a:hover { color: var(--ink); background: var(--paper); }
    }
    .masthead-links a:active { transform: scale(.96); }

    .mobile-tools {
      display: none;
      position: sticky;
      top: 0;
      z-index: 70;
      padding: 8px 14px;
      background: color-mix(in oklch, var(--paper) 94%, transparent);
      box-shadow: 0 1px 0 var(--line);
      font-family: var(--sans);
    }
    .mobile-tools details { flex: 1; min-width: 0; }
    .mobile-tools .print-button { flex: none; margin-left: 8px; }
    .mobile-tools summary {
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      font-size: 13px;
      font-weight: 650;
      list-style: none;
    }
    .mobile-tools summary::-webkit-details-marker { display: none; }
    .mobile-tools summary::after { content: "＋"; color: var(--accent); font-size: 26px; }
    .mobile-tools details[open] summary::after { content: "－"; }
    .mobile-toc {
      display: grid;
      padding: 6px 0 12px;
    }
    .mobile-toc a {
      min-height: 40px;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--muted);
      font-size: 13px;
    }

    .page-shell {
      width: min(1180px, calc(100% - 48px));
      margin: 0 auto;
      display: grid;
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 54px;
      align-items: start;
    }
    .sidebar {
      position: sticky;
      top: 34px;
      max-height: calc(100vh - 68px);
      padding: 42px 0;
      overflow-y: auto;
      scrollbar-width: thin;
      font-family: var(--sans);
    }
    .sidebar-label {
      margin: 0 0 14px;
      color: var(--faint);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .14em;
    }
    .toc-nav { display: grid; gap: 2px; }
    .toc-link {
      position: relative;
      display: block;
      padding: 6px 12px;
      color: var(--muted);
      border-radius: var(--radius-sm);
      font-size: 13px;
      line-height: 1.45;
      text-decoration: none;
      transition-property: color, background-color, transform;
      transition-duration: 150ms;
      transition-timing-function: ease-out;
    }
    .toc-depth-3 { padding-left: 24px; font-size: 13px; color: oklch(57% 0.016 64); }
    .toc-link.active { color: var(--accent); background: var(--accent-soft); }
    .toc-link.active::before {
      content: "";
      position: absolute;
      left: 3px;
      top: 50%;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--accent);
      transform: translateY(-50%);
    }
    .sidebar-actions {
      margin-top: 22px;
      padding-top: 18px;
      border-top: 1px solid var(--line);
    }
    .print-button {
      min-height: 40px;
      padding: 8px 12px;
      color: var(--muted);
      background: transparent;
      border: 0;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-family: var(--sans);
      font-size: 13px;
      text-align: left;
      transition-property: color, background-color, transform;
      transition-duration: 150ms;
      transition-timing-function: ease-out;
    }
    .print-button:active { transform: scale(.96); }

    main {
      min-width: 0;
      padding: 56px clamp(26px, 5vw, 72px) 110px;
      background: var(--paper);
    }
    article { max-width: var(--content); margin: 0 auto; }
    article > h1 { display: none; }
    article p { margin: 1em 0; text-wrap: pretty; }
    article strong { font-weight: 700; }
    article > blockquote:first-of-type {
      margin: 0 0 46px;
      padding: 0 0 24px;
      color: var(--muted);
      border-bottom: 1px solid var(--line);
      font-family: var(--sans);
      font-size: 13px;
      line-height: 1.75;
    }
    article blockquote:not(:first-of-type) {
      margin: 30px 0;
      padding: 4px 0 4px 26px;
      color: var(--muted);
      border-left: 1px solid var(--faint);
    }
    h2, h3 { scroll-margin-top: 34px; text-wrap: balance; }
    h2 {
      margin: 82px 0 28px;
      padding-top: 20px;
      border-top: 1px solid var(--line);
      font-size: 26px;
      line-height: 1.32;
      font-weight: 700;
    }
    h2::before {
      content: attr(id);
      display: block;
      width: 24px;
      height: 3px;
      margin-bottom: 18px;
      overflow: hidden;
      color: transparent;
      background: var(--accent);
    }
    h3 {
      margin: 46px 0 18px;
      font-family: var(--sans);
      font-size: 18px;
      line-height: 1.45;
      font-weight: 700;
    }
    ol, ul { margin: 1em 0; padding-left: 1.45em; }
    li { margin: .38em 0; padding-left: .18em; }
    li::marker { color: var(--accent); font-family: var(--sans); font-weight: 700; }
    code {
      padding: .15em .38em;
      color: oklch(40% 0.09 25);
      background: var(--code);
      border-radius: 4px;
      font-family: var(--mono);
      font-size: 13px;
    }
    pre {
      position: relative;
      margin: 28px 0;
      padding: 24px 24px 28px;
      overflow-x: auto;
      overflow-y: visible;
      color: oklch(25% 0.025 60);
      background: var(--code);
      border-radius: var(--radius-md);
      box-shadow: inset 0 0 0 1px var(--line);
      line-height: 1.68;
      overscroll-behavior-x: contain;
      touch-action: pan-x pan-y;
    }
    pre code { padding: 0; background: transparent; border-radius: 0; font-size: 13px; }
    .copy-code {
      position: absolute;
      top: 10px;
      right: 10px;
      min-width: 56px;
      min-height: 40px;
      padding: 7px 10px;
      color: var(--muted);
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-family: var(--sans);
      font-size: 13px;
      transition-property: color, transform;
      transition-duration: 140ms;
    }
    .copy-code:active { transform: scale(.96); }
    .table-wrap { margin: 30px 0; overflow-x: auto; box-shadow: inset 0 -1px 0 var(--line); }
    table { width: 100%; min-width: 740px; border-collapse: collapse; font-family: var(--sans); font-size: 13px; line-height: 1.6; }
    th, td { padding: 13px 14px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
    th { color: var(--muted); background: var(--code); font-size: 13px; font-weight: 700; }
    td:first-child { white-space: nowrap; font-weight: 700; }
    .article-figure { margin: 42px calc((var(--content) - min(820px, 80vw)) / 2); }
    .article-figure img {
      display: block;
      width: min(820px, 80vw);
      height: auto;
      background: white;
      border-radius: var(--radius-sm);
      outline: 1px solid oklch(30% 0.015 60 / .09);
      outline-offset: -1px;
    }
    figcaption {
      margin-top: 10px;
      color: var(--faint);
      font-family: var(--sans);
      font-size: 13px;
      line-height: 1.6;
      text-align: center;
    }
    article > p:last-child {
      margin-top: 42px;
      padding: 28px 0 0;
      border-top: 1px solid var(--line);
      font-size: 18px;
    }
    :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

    @media (hover: hover) {
      .toc-link:hover, .print-button:hover { color: var(--ink); background: oklch(93.5% 0.014 72); }
      .copy-code:hover { color: var(--accent); }
    }
    @media (max-width: 920px) {
      .masthead { padding: 54px 24px 42px; }
      .masthead-inner { grid-template-columns: 1fr; gap: 26px; }
      .masthead-side { padding-bottom: 0; }
      .masthead-meta { display: flex; gap: 10px; align-items: baseline; }
      .masthead-meta strong { display: inline; }
      .mobile-tools { display: flex; }
      .page-shell { width: 100%; display: block; }
      .sidebar { display: none; }
      main { padding: 42px max(24px, env(safe-area-inset-right)) 80px max(24px, env(safe-area-inset-left)); box-shadow: none; }
      .article-figure { margin: 34px 0; }
      .article-figure img { width: 100%; }
    }
    @media (max-width: 560px) {
      body { line-height: 1.78; }
      .masthead { padding: 42px 20px 34px; }
      .eyebrow { margin-bottom: 12px; }
      main { padding: 34px 20px 70px; }
      h2 { margin-top: 66px; }
      h3 { margin-top: 38px; }
      pre { margin-inline: -8px; padding: 54px 16px 22px; border-radius: var(--radius-sm); }
      figcaption { text-align: left; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }
    @media print {
      @page { margin: 17mm 16mm 20mm; }
      body { background: white; font-size: 11pt; line-height: 1.72; }
      .progress, .mobile-tools, .sidebar, .skip-link { display: none !important; }
      .masthead { padding: 0 0 12mm; color: black; background: white; border-bottom: 1px solid #aaa; }
      .masthead-inner { display: block; }
      .eyebrow { color: #777; }
      .masthead h1 { font-size: 28pt; }
      .masthead-meta { margin-top: 6mm; color: #777; }
      .page-shell { display: block; width: 100%; }
      main { padding: 0; box-shadow: none; }
      article { max-width: none; }
      h2, h3 { break-after: avoid; }
      figure, table, pre { break-inside: avoid; }
      .article-figure { margin: 8mm 0; }
      .article-figure img { width: 100%; max-width: 165mm; margin: auto; }
      .copy-code { display: none; }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#main-content">跳到正文</a>
  <div class="progress" aria-hidden="true"><span id="progress-bar"></span></div>

  <header class="masthead">
    <div class="masthead-inner">
      <div>
        <p class="eyebrow">诗歌写作笔记</p>
        <h1>${title}</h1>
      </div>
      <div class="masthead-side">
        <p class="masthead-meta"><strong>10</strong> 个章节，6 张解释插图<br>从诗句发动机到整诗结构</p>
        <p class="masthead-links"><a href="${repositoryUrl}" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a></p>
      </div>
    </div>
  </header>

  <nav class="mobile-tools" aria-label="移动端文章目录">
    <details>
      <summary>浏览章节</summary>
      <div class="mobile-toc">${mobileToc}</div>
    </details>
    <button class="print-button" type="button" onclick="window.print()">打印</button>
  </nav>

  <div class="page-shell">
    <aside class="sidebar" aria-label="文章目录">
      <p class="sidebar-label">目录</p>
      <nav class="toc-nav">${desktopToc}</nav>
      <div class="sidebar-actions"><button class="print-button" type="button" onclick="window.print()">打印或存为 PDF</button></div>
    </aside>

    <main id="main-content">
      <article>${articleHtml}</article>
    </main>
  </div>

  <script>
    const progressBar = document.getElementById('progress-bar');
    const updateProgress = () => {
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      const ratio = distance > 0 ? root.scrollTop / distance : 0;
      progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, ratio)) + ')';
    };
    document.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const headings = [...document.querySelectorAll('article h2[id], article h3[id]')];
    const tocLinks = [...document.querySelectorAll('.toc-link')];
    const linkById = new Map(tocLinks.map(link => [link.dataset.section, link]));
    const updateActiveSection = () => {
      let current = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 190) current = heading;
        else break;
      }
      tocLinks.forEach(link => link.classList.toggle('active', link === linkById.get(current?.id)));
    };
    document.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    document.querySelectorAll('pre').forEach((pre) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code';
      button.textContent = '复制';
      button.setAttribute('aria-label', '复制代码块');
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.innerText ?? '';
        await navigator.clipboard.writeText(code);
        button.textContent = '已复制';
        window.setTimeout(() => { button.textContent = '复制'; }, 1400);
      });
      pre.appendChild(button);
    });

    document.querySelectorAll('table').forEach((table) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrap';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    document.querySelectorAll('.mobile-toc a').forEach((link) => {
      link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'));
    });
  </script>
</body>
</html>`;

fs.writeFileSync(outputPath, html);
console.log(`Generated ${outputPath.pathname}`);
