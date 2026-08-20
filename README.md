# 网址收藏

一个只使用 HTML 和 CSS 的静态网址收藏展示页，直接托管在 GitHub Pages。

## 修改收藏

所有网址都直接写在 [`index.html`](./index.html) 中，不依赖 JavaScript、构建工具、数据库或后台服务。

新增网址时，在对应分类的 `.link-grid` 中复制一段 `.link-card`，然后修改：

- `href`：网址链接
- `.site-icon`：图标缩写
- `<strong>`：网站名称
- 介绍文字和域名

需要新增分类时，复制一整个 `.link-section`，并在顶部 `.category-nav` 中加入对应的锚点链接。

提交到 `main` 分支后，GitHub Actions 会自动发布到 GitHub Pages。

## 本地查看

直接双击 `index.html` 即可，不需要启动开发服务器。
