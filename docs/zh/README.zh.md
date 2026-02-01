# page_neko.js

PageNeko 是一个简单的 JavaScript 文件，能在网页上添加一只小猫（桌面端）。

默认角色参考自 Neko 桌面宠物，你可以使用默认形象，也可以替换为自己的精灵表来自定义角色。

## 演示

https://somwhy.github.io/PageNeko/

![演示动图](https://github.com/user-attachments/assets/2bd2e8eb-8e7c-44f8-a460-d78295184b02)
![演示动图](https://github.com/user-attachments/assets/216808aa-a556-4479-9395-6c1050aab4c6)
![演示动图](https://github.com/user-attachments/assets/7af02366-56f8-4620-84c4-9582cd2d3a6a)

## 功能简介

- 猫咪的情绪会随机变化，情绪决定其行为状态。
- 情绪高兴时会追逐并“吃掉”光标。
- 情绪平静时会忽略光标并进入睡眠。
- 撞到墙壁会抓挠墙面，表情很可爱。
- 睡眠状态下可以拖动并放置位置。
- 点击睡着的猫咪周围会把它吵醒或惊吓到。
- 浅睡时点击会引起摇晃反应，深睡时点击会引起跳跃反应。
- 启用 ZZZ 动画后，睡觉时会显示 ZZZ 提示。
- 没有额外的控制按钮，行为更拟真；同时易于定制。

## 快速安装

将 `page_neko.js` 和精灵表 `nekos.webp` 放在要运行的页面同目录下，然后在页面底部引入：

```html
<body>
  <!-- 页面其他内容 -->
  <script src="page_neko.js"></script>
</body>
```

就能在页面上看到可交互的小猫了。

## 致谢

- PageNeko 使用了与 pet-cursor 相同的猫咪图像资源，感谢 pet-cursor (https://github.com/alienmelon/pet_cursor.js)。
- 默认角色基于 Neko 桌面宠物 (https://en.wikipedia.org/wiki/Neko_(software))。
- 感谢 Web Neko 的灵感 (https://webneko.net/)。

## 如何自定义

### 精灵表（Sprite Sheet）自定义

- 更换图片：PageNeko 使用单张精灵表 `nekos.webp`。要自定义角色，请准备一张与原始尺寸和帧顺序一致的精灵表。
- 精灵表结构：34 列 × 1 行，每帧 42 × 42 像素。帧的顺序须与代码中 `framePositions` 对象一致。
- 修改路径：在 `page_neko.js` 的 `SPRITE_CONFIG` 区域更新精灵表路径，例如：

```javascript
const SPRITE_CONFIG = {
  frameWidth: 42,
  frameHeight: 42,
  columns: 34,
  rows: 1,
  spritePath: "/nekos.webp", // 修改为你的精灵表路径
}
```

### 其他定制项

- 动画节奏：见代码中 `Timing Constants` 注释。
- 物理与运动：见 `Physics Constants` 注释。
- 睡眠行为：见 `Sleep Constants` 注释。
- ZZZ 动画：见 `ZZZ Animation Constants` 注释，可通过 `ENABLE_ZZZ_ANIMATION` 开关控制。
- 猫咪尺寸与速度：见 `Pet Constants` 注释（图片尺寸会影响性能）。
- 深睡所需时间：调整 `SLEEP.MATURE_TIME`（单位 ms）。

## 贡献者

<a href="https://github.com/SOMWHY/PageNeko/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SOMWHY/PageNeko" />
</a>

## Star 趋势

[![Stargazers over time](https://starchart.cc/SOMWHY/PageNeko.svg?variant=adaptive)](https://starchart.cc/SOMWHY/PageNeko)
