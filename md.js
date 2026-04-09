const allowedPrefixes = ["projects/", "logbook/"];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    const safeUrl = escapeHtml(url);
    return `<a href="${safeUrl}">${escapeHtml(label)}</a>`;
  });
  return html;
}

function extractDescription(markdown) {
  const lines = markdown.split(/\r?\n/);
  let index = 0;
  while (index < lines.length && lines[index].trim() === "") index += 1;
  if (index < lines.length && lines[index].startsWith("#")) index += 1;
  while (index < lines.length && lines[index].trim() === "") index += 1;

  const paragraph = [];
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "") break;
    if (line.startsWith("#") || line.startsWith("```") || line.startsWith("- ") || line.startsWith(">")) break;
    paragraph.push(line.trim());
    index += 1;
  }
  return paragraph.join(" ").trim();
}

function renderMarkdown(markdown, { omitDescription = "" } = {}) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let inCode = false;
  let codeLang = "";
  let listOpen = false;
  let paragraph = [];
  let omittedOnce = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    if (!omittedOnce && omitDescription && text === omitDescription) {
      omittedOnce = true;
    } else {
      out.push(`<p>${renderInline(text)}</p>`);
    }
    paragraph = [];
  };

  const closeList = () => {
    if (!listOpen) return;
    out.push("</ul>");
    listOpen = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");

    if (line.startsWith("```")) {
      flushParagraph();
      closeList();
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        out.push(`<pre><code class="lang-${escapeHtml(codeLang)}">`);
      } else {
        inCode = false;
        codeLang = "";
        out.push("</code></pre>");
      }
      continue;
    }

    if (inCode) {
      out.push(escapeHtml(line) + "\n");
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      closeList();
      out.push(`<h2>${renderInline(line.slice(2).trim())}</h2>`);
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      closeList();
      out.push(`<h3>${renderInline(line.slice(3).trim())}</h3>`);
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      closeList();
      out.push(`<h4>${renderInline(line.slice(4).trim())}</h4>`);
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      closeList();
      out.push(`<blockquote>${renderInline(line.replace(/^>+\s?/, ""))}</blockquote>`);
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      if (!listOpen) {
        listOpen = true;
        out.push("<ul>");
      }
      out.push(`<li>${renderInline(line.slice(2).trim())}</li>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  return out.join("\n");
}

function getRequestedFile() {
  try {
    let file = "";
    const search = String(window.location.search || "");

    if (typeof URLSearchParams !== "undefined") {
      const params = new URLSearchParams(search);
      file = params.get("file") || "";
    } else if (search.startsWith("?")) {
      const parts = search.slice(1).split("&");
      for (const part of parts) {
        const [rawKey, rawValue] = part.split("=");
        const key = decodeURIComponent(rawKey || "");
        if (key === "file") {
          file = decodeURIComponent(rawValue || "");
          break;
        }
      }
    }

    const normalized = String(file).replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/+/, "");

    if (!normalized.endsWith(".md")) return null;
    if (!allowedPrefixes.some((prefix) => normalized.startsWith(prefix))) return null;
    if (normalized.includes("..")) return null;

    return normalized;
  } catch (_error) {
    return null;
  }
}

async function main() {
  const file = getRequestedFile();
  const titleEl = document.querySelector("#md-title");
  const descEl = document.querySelector("#md-desc");
  const bodyEl = document.querySelector("#md-body");

  if (!file) {
    titleEl.textContent = "invalid.md";
    descEl.textContent = "Use ?file=projects/NAME.md or ?file=logbook/YYYY-MM-DD.md";
    bodyEl.innerHTML = "<p>Nothing to show.</p>";
    return;
  }

  titleEl.textContent = file.split("/").pop() || file;

  const response = await fetch(file, { cache: "no-store" });
  if (!response.ok) {
    descEl.textContent = `Could not load ${file}`;
    bodyEl.innerHTML = `<p>HTTP ${response.status}</p>`;
    return;
  }

  const markdown = await response.text();
  const description = extractDescription(markdown);
  descEl.textContent = description;
  bodyEl.innerHTML = renderMarkdown(markdown, { omitDescription: description });
}

main().catch((error) => {
  const titleEl = document.querySelector("#md-title");
  const descEl = document.querySelector("#md-desc");
  const bodyEl = document.querySelector("#md-body");

  if (titleEl) titleEl.textContent = "error.md";
  if (descEl) descEl.textContent = "Failed to render markdown.";
  if (bodyEl) bodyEl.innerHTML = `<pre><code>${escapeHtml(String(error?.stack || error))}</code></pre>`;
});
