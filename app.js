(function () {
  "use strict";

  const bookmarks = Array.isArray(window.BOOKMARKS) ? window.BOOKMARKS : [];
  const state = { category: "全部", query: "" };
  const elements = {
    categoryNav: document.querySelector("#categoryNav"),
    bookmarkGrid: document.querySelector("#bookmarkGrid"),
    bookmarkCount: document.querySelector("#bookmarkCount"),
    emptyState: document.querySelector("#emptyState"),
    footerYear: document.querySelector("#footerYear"),
    resultCount: document.querySelector("#resultCount"),
    searchInput: document.querySelector("#searchInput"),
    sectionEyebrow: document.querySelector("#sectionEyebrow"),
    sectionTitle: document.querySelector("#sectionTitle"),
    themeButton: document.querySelector("#themeButton"),
  };

  const categories = ["全部", ...new Set(bookmarks.map((item) => item.category))];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  function getFavicon(url) {
    try {
      const parsed = new URL(url);
      return `${parsed.origin}/favicon.ico`;
    } catch {
      return "";
    }
  }

  function getVisibleBookmarks() {
    const normalizedQuery = state.query.trim().toLocaleLowerCase("zh-CN");
    return bookmarks.filter((bookmark) => {
      const matchesCategory =
        state.category === "全部" || bookmark.category === state.category;
      if (!normalizedQuery) return matchesCategory;

      const searchable = [
        bookmark.title,
        bookmark.description,
        bookmark.category,
        ...(bookmark.tags || []),
        getDomain(bookmark.url),
      ]
        .join(" ")
        .toLocaleLowerCase("zh-CN");
      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }

  function renderCategories() {
    elements.categoryNav.innerHTML = categories
      .map((category) => {
        const count =
          category === "全部"
            ? bookmarks.length
            : bookmarks.filter((item) => item.category === category).length;
        return `
          <button
            class="category-button"
            type="button"
            data-category="${escapeHtml(category)}"
            aria-pressed="${state.category === category}"
          >${escapeHtml(category)} <span aria-hidden="true">${count}</span></button>
        `;
      })
      .join("");
  }

  function renderBookmarks() {
    const visibleBookmarks = getVisibleBookmarks();
    elements.bookmarkGrid.innerHTML = visibleBookmarks
      .map((bookmark) => {
        const title = escapeHtml(bookmark.title);
        const favicon = getFavicon(bookmark.url);
        const initial = Array.from(bookmark.title)[0] || "#";
        return `
          <a
            class="bookmark-card"
            href="${escapeHtml(bookmark.url)}"
            target="_blank"
            rel="noopener noreferrer"
            style="--card-accent: ${escapeHtml(bookmark.color || "var(--accent)")}"
            aria-label="打开 ${title}（新窗口）"
          >
            <div class="card-top">
              <span class="site-icon">
                ${
                  favicon
                    ? `<img src="${escapeHtml(favicon)}" alt="" loading="lazy" data-fallback="${escapeHtml(initial)}" />`
                    : escapeHtml(initial)
                }
              </span>
              <span class="external-arrow" aria-hidden="true">↗</span>
            </div>
            <h2>${title}</h2>
            <p>${escapeHtml(bookmark.description || "")}</p>
            <div class="card-meta">
              <span class="card-category">${escapeHtml(bookmark.category)}</span>
              <span class="card-domain">${escapeHtml(getDomain(bookmark.url))}</span>
            </div>
          </a>
        `;
      })
      .join("");

    elements.bookmarkGrid.hidden = visibleBookmarks.length === 0;
    elements.emptyState.hidden = visibleBookmarks.length > 0;
    elements.resultCount.textContent = `${visibleBookmarks.length} 个网址`;
    elements.sectionEyebrow.textContent =
      state.category === "全部" ? "全部收藏" : state.category;
    elements.sectionTitle.textContent = state.query
      ? `“${state.query}” 的搜索结果`
      : state.category === "全部"
        ? "常用网址，一目了然"
        : `${state.category}收藏`;

    elements.bookmarkGrid.querySelectorAll("img[data-fallback]").forEach((image) => {
      image.addEventListener("error", () => {
        image.parentElement.textContent = image.dataset.fallback;
      });
    });
  }

  function setCategory(category) {
    state.category = category;
    renderCategories();
    renderBookmarks();
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("bookmark-theme", theme);
    const isDark = theme === "dark";
    elements.themeButton.setAttribute(
      "aria-label",
      isDark ? "切换浅色模式" : "切换深色模式",
    );
    elements.themeButton.title = isDark ? "切换浅色模式" : "切换深色模式";
  }

  elements.categoryNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (button) setCategory(button.dataset.category);
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    renderBookmarks();
  });

  elements.themeButton.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      event.preventDefault();
      elements.searchInput.focus();
    }
    if (event.key === "Escape" && document.activeElement === elements.searchInput) {
      elements.searchInput.value = "";
      state.query = "";
      renderBookmarks();
      elements.searchInput.blur();
    }
  });

  const savedTheme = localStorage.getItem("bookmark-theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  applyTheme(savedTheme || systemTheme);
  elements.bookmarkCount.textContent = `共 ${bookmarks.length} 个网址`;
  elements.footerYear.textContent = new Date().getFullYear();
  renderCategories();
  renderBookmarks();
})();
