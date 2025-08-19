# page_neko.js

PageNeko 是一个简单的 JavaScript 文件，可以立即为您的网站添加一只猫咪！

默认角色基于 [the Neko desktop pet](https://en.wikipedia.org/wiki/Neko_(software))，您可以使用默认角色，也可以轻松更改为自定义角色。自定义非常简单，只需修改 **page_neko.js** 文件中的几个数组。

## [点击此处查看演示](https://somwhy.github.io/PageNeko/)

![演示动图](https://github.com/user-attachments/assets/2bd2e8eb-8e7c-44f8-a460-d78295184b02)
![演示动图](https://github.com/user-attachments/assets/216808aa-a556-4479-9395-6c1050aab4c6)
![演示动图](https://github.com/user-attachments/assets/7af02366-56f8-4620-84c4-9582cd2d3a6a)

## 主要功能

- 猫咪的情绪会随机变化，情绪决定其行为状态
- 当猫咪开心时，会追逐您的鼠标并"吃掉"它
- 当猫咪平静时，会忽略鼠标进入睡眠状态
- 当猫咪撞到墙壁时，会沮丧地抓墙（啊～太可爱了～）
- 睡眠状态时可拖动放置
- 点击睡眠中的猫咪周围会惊吓到它
- 浅睡状态下点击会引起“摇晃”反应
- 深睡状态下点击会引起“跳跃”反应
- 启用"ZZZ"动画后，猫咪睡觉时会显示"ZZZ"
- 没有各种按钮，个人认为更加拟真
- 自定义门槛低

## 快速安装指南

1. 将 **page_neko.js** 和 **images_neko** 文件夹放在您网站页面的同一目录下
2. 在页面底部添加脚本引用：

```html
<body>
  <!-- 其他内容... -->
  <script src="page_neko.js"></script>
</body>
```

完成！您的页面现在会有一只可爱的互动猫咪了～

# 特别鸣谢

- PageNeko 可以看做是 pet-cursor 的DLC版本，使用了相同的猫咪图像资源。感谢 [pet-cursor](https://github.com/alienmelon/pet_cursor.js)！
- 默认角色基于 [the Neko desktop pet](https://en.wikipedia.org/wiki/Neko_(software))
- 同时感谢 [Web Neko](https://webneko.net/) 的灵感

# 如何自定义

- 替换图片
1. 替换 `images_neko` 文件夹中的图片
2. 在 **page_neko.js** 的"Image Configuration"部分更新文件名

- 动画相关
请见"Timing Constants"部分

- 物理和运动
请见"Physics Constants"部分

- 睡眠行为
请见"Sleep Constants"部分

- ZZZ动画效果
请见"ZZZ Animation Constants"部分

- 备用显示
请见"Fallback Constants"部分

- 猫咪大小
请见"Pet Constants"部分（图片大小影响会性能）

- 猫咪速度
请见"Pet Constants"部分

- 心情变化快慢
请见"Pet Constants"部分

- 熟睡所需时间
调整 SLEEP.MATURE_TIME

- 猫咪样式定制
在"Pet Element Styles"部分自定义CSS：

- 开关“zzz”动画
设置 ENABLE_ZZZ_ANIMATION 为 true/false

## 贡献者
<a href="https://github.com/SOMWHY/PageNeko/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SOMWHY/PageNeko" />
</a>

## Star趋势
[![Stargazers over time](https://starchart.cc/SOMWHY/PageNeko.svg?variant=adaptive)](https://starchart.cc/SOMWHY/PageNeko)