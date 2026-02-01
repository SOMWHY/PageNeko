# page_neko.js

PageNeko is a simple JavaScript file that adds a cat to your website (desktop).

The default character is based on the Neko desktop pet. You can use the default or replace it with your own sprite sheet.

## Demo

https://somwhy.github.io/PageNeko/

![demo](https://github.com/user-attachments/assets/2bd2e8eb-8e7c-44f8-a460-d78295184b02)
![demo](https://github.com/user-attachments/assets/216808aa-a556-4479-9395-6c1050aab4c6)
![demo](https://github.com/user-attachments/assets/7af02366-56f8-4620-84c4-9582cd2d3a6a)

## Features include

- The cat's mood changes randomly, and its mood determines its behavior (status).
- When happy, the cat will chase your mouse and "eat" it.
- When calm, the cat ignores the mouse and falls asleep.
- When the cat bumps into a wall, it scratches the wall in frustration.
- You can drag and place the cat when it's sleeping.
- Clicking near a sleeping cat can startle it.
- Clicking during light sleep causes a "shake" reaction; during deep sleep it causes a "jump" reaction.
- When enabled, a "ZZZ" animation appears while sleeping.
- No mood-control buttons are shown; behavior is intended to feel more natural. The project is easy to customize.

## Getting PageNeko on your page

Place `page_neko.js` and the sprite sheet `nekos.webp` in the same directory as the page where you want to run it, then include the script at the bottom of the page:

<body>
  <!-- other content -->
  <script src="page_neko.js"></script>
</body>

That's it  your page should now have a cute interactive pet.

## Thanks to

- This project uses the same cat images as pet-cursor. Thanks to pet-cursor (https://github.com/alienmelon/pet_cursor.js).
- The default character is based on the Neko desktop pet (https://en.wikipedia.org/wiki/Neko_(software)).
- Thanks also to Web Neko (https://webneko.net/).

## How to customize

### Sprite sheet customization

- Change the images: PageNeko uses a single sprite sheet (`nekos.webp`). To customize the cat, create a sprite sheet with the same dimensions and frame order.
- Sprite sheet structure: 34 columns  1 row, each frame 4242 pixels. Frames must follow the order defined in the `framePositions` object in the code.
- Sprite sheet path: change the path in the `SPRITE_CONFIG` section of `page_neko.js`:

const SPRITE_CONFIG = {
  frameWidth: 42,
  frameHeight: 42,
  columns: 34,
  rows: 1,
  spritePath: "/nekos.webp", // Change this path to your sprite sheet
}

### Other settings

- Animation timing: see the "Timing Constants" comments in the code.
- Physics and movement: see the "Physics Constants" comments.
- Sleep behavior: see the "Sleep Constants" comments.
- ZZZ animation: see the "ZZZ Animation Constants" and toggle with `ENABLE_ZZZ_ANIMATION`.
- Pet size and speed: see the "Pet Constants" (image size affects performance).
- Time to deep sleep: adjust `SLEEP.MATURE_TIME` (ms).

## Contributors

<a href="https://github.com/SOMWHY/PageNeko/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SOMWHY/PageNeko" />
</a>

## Stargazers over time

[![Stargazers over time](https://starchart.cc/SOMWHY/PageNeko.svg?variant=adaptive)](https://starchart.cc/SOMWHY/PageNeko)
