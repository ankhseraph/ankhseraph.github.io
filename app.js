function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function extractDescription(markdown) {
  const lines = String(markdown).split(/\r?\n/);
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

function sortFiles(kind, files) {
  const list = Array.from(files);
  if (kind === "logbook") {
    return list.sort((a, b) => String(b).localeCompare(String(a)));
  }
  return list.sort((a, b) => String(a).localeCompare(String(b)));
}

async function loadCards({ kind, containerId, basePath }) {
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = `<div class="muted">Loading…</div>`;

  let files;
  try {
    const indexResponse = await fetch(`${basePath}/index.json`, { cache: "no-store" });
    if (!indexResponse.ok) throw new Error(`index.json HTTP ${indexResponse.status}`);
    const indexJson = await indexResponse.json();
    files = sortFiles(kind, indexJson);
  } catch (_error) {
    container.innerHTML = `<div class="muted">No ${escapeHtml(kind)} yet.</div>`;
    return;
  }

  if (!files || files.length === 0) {
    container.innerHTML = `<div class="muted">No ${escapeHtml(kind)} yet.</div>`;
    return;
  }

  container.innerHTML = "";

  for (const name of files) {
    const file = `${basePath}/${name}`;
    let description = "";

    try {
      const response = await fetch(file, { cache: "no-store" });
      if (response.ok) {
        const markdown = await response.text();
        description = extractDescription(markdown) || "";
      }
    } catch (_error) {
      description = "";
    }

    const card = document.createElement("a");
    card.className = "md-card";
    card.href = `md.html?file=${encodeURIComponent(file)}`;
    card.innerHTML = `
      <div class="md-card-title">${escapeHtml(name)}</div>
      <div class="md-card-desc">${escapeHtml(description || "")}</div>
    `;
    container.appendChild(card);
  }
}

window.addEventListener("load", () => {
  loadCards({ kind: "projects", containerId: "#projects-grid", basePath: "projects" });
  loadCards({ kind: "logbook", containerId: "#logbook-grid", basePath: "logbook" });
});
