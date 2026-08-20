# 网址收藏

一个专注于浏览和查找的静态网址收藏页。没有后台和编辑界面，适合直接托管在 GitHub Pages。

## 修改收藏

所有网址都在 [`bookmarks.js`](./bookmarks.js) 的 `window.BOOKMARKS` 数组中。复制一个对象并修改以下字段即可：

```js
{
  title: "网站名称",
  url: "https://example.com/",
  description: "一句简短介绍。",
  category: "分类名称",
  tags: ["搜索标签", "另一个标签"],
  color: "#1f6b4f",
}
```

- `category` 相同的网址会自动归入同一分类。
- `tags` 会参与搜索，但不会显示在卡片上。
- `color` 用于卡片悬停时的强调色。
- 数组中的先后顺序就是网页中的展示顺序。

提交到默认分支后，GitHub Actions 会自动发布到 GitHub Pages。

## 本地查看

直接双击 `index.html` 即可，也可以在目录中运行任意静态文件服务器。
