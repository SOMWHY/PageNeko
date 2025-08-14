# page_neko.js

PageNeko is a simple javascript file that immediately adds a cat to your website! (for the desktop)

The default character is based on [the Neko desktop pet](<https://en.wikipedia.org/wiki/Neko_(software)>), you can use this default, or easily change the character to your own. Customization is simple, just update a few arrays in **page_neko.js** file.

## [Click here for a demo.](https://somwhy.github.io/PageNeko/)

![Demo gif](https://github.com/user-attachments/assets/2bd2e8eb-8e7c-44f8-a460-d78295184b02)
![Demo gif](https://github.com/user-attachments/assets/216808aa-a556-4479-9395-6c1050aab4c6)
![Demo gif](https://github.com/user-attachments/assets/7af02366-56f8-4620-84c4-9582cd2d3a6a)

## Features include...

- The cat's mood changes randomly, and its mood determines its behavior(status).
- When the cat is happy, it will chase your mouse and "eat" it.
- When the cat is calm, it will ignore your mouse and fall into sleep.
- When the cat bumps into a wall, it will scratch the wall in frustration.(Ah~so cute~)
- You can drag to place it when it's sleeping.
- If you click around the sleeping cat, it will get surprised.
- When the cat is in light sleep, clicking causes a mild reaction
- When the cat is in deep sleep, clicking causes a strong reaction
- You will see the "ZZZ" animation when the cat sleeps if you enable it. 
- You won't see a button for changing it's mood or something else, as I personally consider it's more realistic
- It's easy to customize.

## Getting Page Neko on your page is easy! Just do the following...

Place **page_neko.js** and the **images_neko** folder in the same directory as the page that you would like to run it on.
Then include the javascript file as same as the following template

```
<body>
other content...
<script src="page_neko.js"></script>
</body>

```

That's it! Your page should now have a cute little playable living creature...

# Thanks to...

- PageNeko is basically a beta version of pet-cursor. This project uses the same images of cat as pet-cursor. Thanks to pet-cursor(<https://github.com/alienmelon/pet_cursor.js>)!
- The default character is based on [the Neko desktop pet](<https://en.wikipedia.org/wiki/Neko_(software)>)
- Also thanks to Web Neko: https://webneko.net/

# How to customize

- Change the images: You should change the images in images_neko folder, then change the file name in "Image Configuration"
- Animation timing and more: See in "Animation Constants"
- Cat size: See in the comment "Pet Constants"(Size of images affects performance)
- Cat speed: See in the comment "Pet Constants"
- Mood changing rate: See in the comment "Pet Constants"
- Cat styling: See in the comment "Pet Element Styles"
- Trun on/off "ZZZ" animation when sleeping: Set ENABLE_ZZZ_ANIMATION to true/false