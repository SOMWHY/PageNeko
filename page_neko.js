// Configuration constant for cache usage
const USE_CACHE = true; // Set to false to disable caching
const CACHE_VERSION = "v1"; // Change this to invalidate old caches
const ENABLE_ZZZ_ANIMATION = true; // Set to false to disable sleep ZZZ animation

// Image preloader with caching and error handling
const preloadImages = (() => {
  const images = {};
  const promises = [];
  const loadedImages = new Set();

  // Create image loading promises with caching
  function createImageLoadPromise(path) {
    return new Promise((resolve) => {
      const storageKey = `neko_img_${CACHE_VERSION}_${path.replace(
        /\//g,
        "_"
      )}`;
      const img = new Image();

      // Check if cached version exists
      if (USE_CACHE && localStorage.getItem(storageKey)) {
        try {
          img.src = localStorage.getItem(storageKey);
          img.onload = () => {
            images[path] = img;
            loadedImages.add(path);
            resolve();
          };
          img.onerror = () => {
            console.error(`Cached image failed: ${path}`);
            loadFromNetwork();
          };
          return;
        } catch (e) {
          console.error("Cache load error:", e);
        }
      }

      // Load from network if no cache available
      loadFromNetwork();

      function loadFromNetwork() {
        img.onload = () => {
          images[path] = img;
          loadedImages.add(path);

          // Cache the loaded image
          if (USE_CACHE) {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              localStorage.setItem(storageKey, canvas.toDataURL("image/png"));
            } catch (e) {
              console.error("Caching failed:", e);
            }
          }
          resolve();
        };

        img.onerror = () => {
          console.error(`Failed to load image: ${path}`);
          createFallbackElement(path);
          resolve();
        };

        img.src = path;
      }
    });
  }

  // Create visual fallback for debugging
  function createFallbackElement(path) {
    const fallback = document.createElement("div");
    fallback.style.cssText = `
            position: absolute;
            width: 42px;
            height: 42px;
            background-color: #ff6b6b;
            color: white;
            font-size: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            z-index: ${petElement.style.zIndex - 1};
        `;
    fallback.textContent = path.split("/").pop().replace(".png", "");
    document.body.appendChild(fallback);
  }

  return {
    load: function (paths) {
      paths.forEach((path) => {
        if (!loadedImages.has(path)) {
          promises.push(createImageLoadPromise(path));
        }
      });
      return Promise.all(promises);
    },
    get: function (path) {
      return images[path];
    },
    // Add method to clear cache if needed
    clearCache: function () {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("neko_img_")) {
          localStorage.removeItem(key);
        }
      });
    },
  };
})();

// =====================================
// ZZZ Animation Configuration
// =====================================

// Global flag to control ZZZ animations
let isZZZAnimationActive = false;

// Container for ZZZ elements
const zzzContainer = document.createElement("div");
zzzContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9998; /* Below the cat */
`;
document.body.appendChild(zzzContainer);

// Function to create a single ZZZ element
function createZZZElement() {
  const zzz = document.createElement("div");
  zzz.textContent = "z".repeat(1 + Math.floor(Math.random() * 3)); // 1-3 "z"s
  zzz.style.cssText = `
        position: absolute;
        color: rgba(150, 150, 150, 0.7);
        font-family: Arial, sans-serif;
        font-weight: bold;
        font-size: ${14 + Math.random() * 8}px;
        opacity: 0;
        transition: opacity 0.5s, transform 2s ease-out;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
    `;
  return zzz;
}

// Function to animate ZZZ elements
function animateZZZ() {
  const zzz = createZZZElement();

  if (!isZZZAnimationActive || !ENABLE_ZZZ_ANIMATION){
    removeZZZ();
    return;
  }

  // Position above the sleeping cat (adjust for cat head position)
  const catHeadX = petX + PET_WIDTH / 2;
  const catHeadY = petY + PET_HEIGHT * 0.2; // Head is at 20% from top

  const offsetX = (Math.random() - 0.5) * 20;
  const offsetY = -Math.random() * 10; // Just above head

  zzz.style.left = `${catHeadX + offsetX}px`;
  zzz.style.top = `${catHeadY + offsetY}px`;
  zzz.style.opacity = "1";
  zzzContainer.appendChild(zzz);

  // Animate upward movement
  setTimeout(() => {
    zzz.style.opacity = "0";
    zzz.style.transform = "translateY(-40px) translateX(20px)";

    // Remove element after animation completes
    setTimeout(() => {
      if (zzz.parentNode) {
        zzzContainer.removeChild(zzz);
      }
    }, 500);
  }, 100);

  // Schedule next ZZZ animation
  setTimeout(animateZZZ, 1000 + Math.random() * 1500);
}

function removeZZZ() {
  isZZZAnimationActive = false;
  zzzContainer.textContent = '';
}

// Cat animation image directory
const str_pageNeko_directory = "images_neko/";

// Cat animation frame arrays
const arr_pageNeko_down = ["CUR_DOWN_FRAME01.png", "CUR_DOWN_FRAME02.png"];
const arr_pageNeko_down_left = [
  "CUR_DOWN_LEFT_FRAME01.png",
  "CUR_DOWN_LEFT_FRAME02.png",
];
const arr_pageNeko_down_right = [
  "CUR_DOWN_RIGHT_FRAME01.png",
  "CUR_DOWN_RIGHT_FRAME02.png",
];
const arr_pageNeko_left = ["CUR_LEFT_FRAME01.png", "CUR_LEFT_FRAME02.png"];
const arr_pageNeko_right = ["CUR_RIGHT_FRAME01.png", "CUR_RIGHT_FRAME02.png"];
const arr_pageNeko_up = ["CUR_UP_FRAME01.png", "CUR_UP_FRAME02.png"];
const arr_pageNeko_up_left = [
  "CUR_UP_LEFT_FRAME01.png",
  "CUR_UP_LEFT_FRAME02.png",
];
const arr_pageNeko_up_right = [
  "CUR_UP_RIGHT_FRAME01.png",
  "CUR_UP_RIGHT_FRAME02.png",
];
const arr_pageNeko_surprised = [
  "CUR_SURPRISE_FRAME01.png",
  "CUR_SURPRISE_FRAME02.png",
];
const arr_pageNeko_idle = ["CUR_IDLE_FRAME01.png", "CUR_IDLE_FRAME02.png"];
const arr_pageNeko_idling = [
  "CUR_IDLING_FRAME01.png",
  "CUR_IDLING_FRAME02.png",
];
const arr_pageNeko_sleep_start = [
  "CUR_SLEEPSTART_FRAME01.png",
  "CUR_SLEEPSTART_FRAME02.png",
];
const arr_pageNeko_sleeping = [
  "CUR_SLEEP_FRAME01.png",
  "CUR_SLEEP_FRAME02.png",
];

// Scratching (all directions)
const arr_pageNeko_scratch_down = [
  "CUR_SCRATCH_DOWN_FRAME01.png",
  "CUR_SCRATCH_DOWN_FRAME02.png",
];
const arr_pageNeko_scratch_left = [
  "CUR_SCRATCH_LEFT_FRAME01.png",
  "CUR_SCRATCH_LEFT_FRAME02.png",
];
const arr_pageNeko_scratch_right = [
  "CUR_SCRATCH_RIGHT_FRAME01.png",
  "CUR_SCRATCH_RIGHT_FRAME02.png",
];
const arr_pageNeko_scratch_up = [
  "CUR_SCRATCH_UP_FRAME01.png",
  "CUR_SCRATCH_UP_FRAME02.png",
];

// Collect all image paths for preloading
const allImagePaths = [
  ...arr_pageNeko_down,
  ...arr_pageNeko_down_left,
  ...arr_pageNeko_down_right,
  ...arr_pageNeko_left,
  ...arr_pageNeko_right,
  ...arr_pageNeko_up,
  ...arr_pageNeko_up_left,
  ...arr_pageNeko_up_right,
  ...arr_pageNeko_surprised,
  ...arr_pageNeko_idle,
  ...arr_pageNeko_idling,
  ...arr_pageNeko_sleep_start,
  ...arr_pageNeko_sleeping,
  ...arr_pageNeko_scratch_down,
  ...arr_pageNeko_scratch_left,
  ...arr_pageNeko_scratch_right,
  ...arr_pageNeko_scratch_up,
].map((img) => str_pageNeko_directory + img);

// Direction constants
const DIRECTION = {
  DOWN: 0,
  DOWN_LEFT: 1,
  LEFT: 2,
  UP_LEFT: 3,
  UP: 4,
  UP_RIGHT: 5,
  RIGHT: 6,
  DOWN_RIGHT: 7,
};

// State constants
const STATE = {
  MOVING: 0,
  IDLE: 1,
  IDLING: 2,
  SLEEPING: 3,
};

// Mood constants
const MOOD = {
  HAPPY: 0,
  CALM: 1,
};

// Global parameters
const RUN_FRAME_INTERVAL = 280;
const IDLE_TO_IDLING_DELAY = 1200;
const IDLING_FRAME_INTERVAL = 500;
const IDLING_REPEAT = 3;
const SLEEP_MATURE_TIME = 5000;
const SURPRISED_FRAME_INTERVAL = 400;
const SURPRISED_REPEAT = 2;
const MOUSE_IDLE_DELAY = 500;
const MOOD_CHANGE_MIN = 60000;
const MOOD_CHANGE_MAX = 120000;
const CATCH_DISTANCE = 5;

// Cat width and height
const PET_WIDTH = 42;
const PET_HEIGHT = 42;

// Position variables
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let petX = targetX;
let petY = targetY;

// Track mouse position
let lastMouseX = 0;
let lastMouseY = 0;

// Cat movement speed
const PET_SPEED = 0.8;

// Jump parameters
const JUMP_INITIAL_HEIGHT = -30;
const JUMP_GRAVITY = 2;

// Direction to animation array mapping
const directionAnimations = {
  [DIRECTION.DOWN]: arr_pageNeko_down,
  [DIRECTION.DOWN_LEFT]: arr_pageNeko_down_left,
  [DIRECTION.LEFT]: arr_pageNeko_left,
  [DIRECTION.UP_LEFT]: arr_pageNeko_up_left,
  [DIRECTION.UP]: arr_pageNeko_up,
  [DIRECTION.UP_RIGHT]: arr_pageNeko_up_right,
  [DIRECTION.RIGHT]: arr_pageNeko_right,
  [DIRECTION.DOWN_RIGHT]: arr_pageNeko_down_right,
};

// Drag variables
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartPetX = 0;
let dragStartPetY = 0;
const DRAG_THRESHOLD = 5;
let dragStartEvent = null;

// Create cat element with style
const petElement = document.createElement("div");
petElement.id = "neko";
Object.assign(petElement.style, {
  position: "absolute",
  width: `${PET_WIDTH}px`,
  height: `${PET_HEIGHT}px`,
  pointerEvents: "none",
  zIndex: "9999",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  transformOrigin: "center",
  transition: "transform 0.1s ease",
  display: "none",
  backgroundColor: "#f0f0f0", // Fallback background
  border: "1px dashed #ccc", // Visible placeholder
});
document.body.appendChild(petElement);

// Cat state machine class
class CatStateMachine {
  constructor() {
    this.state = STATE.MOVING;
    this.prevState = null;
    this.mood = MOOD.HAPPY;
    this.direction = DIRECTION.DOWN;
    this.frame = 0;
    this.idleTimer = null;
    this.idlingTimer = null;
    this.sleepTimer = null;
    this.moodTimer = null;
    this.sleepStartTime = null;
    this.isMouseIdle = false;
    this.isSurprised = false;
    this.surprisedMode = 1;
    this.idlingCount = 0;
    this.jumpY = 0;
    this.jumpV = 0;
    this.isJumping = false;
    this.frameInterval = null;
  }

  transition(newState) {
    removeZZZ()
    if (this.state === STATE.IDLE && this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    } else if (this.state === STATE.IDLING && this.idlingTimer) {
      clearTimeout(this.idlingTimer);
      this.idlingTimer = null;
    }

    this.isSurprised = false;
    this.isJumping = false;
    this.jumpY = 0;
    this.jumpV = 0;

    this.prevState = this.state;
    this.state = newState;
    this.frame = 0;

    // Handle ZZZ animation state changes
    if (newState === STATE.SLEEPING) {
      isZZZAnimationActive = true;
      if (ENABLE_ZZZ_ANIMATION) {
        animateZZZ();
      }
    } else if (this.state === STATE.SLEEPING && newState !== STATE.SLEEPING) {
      removeZZZ()
    }

    switch (newState) {
      case STATE.IDLE:
        this.idleTimer = setTimeout(() => {
          this.transition(STATE.IDLING);
        }, IDLE_TO_IDLING_DELAY);
        break;
      case STATE.IDLING:
        this.idlingCount = 0;
        if (this.mood === MOOD.CALM) {
          this.setIdlingSleepTimer();
        }
        break;
      case STATE.SLEEPING:
        this.sleepStartTime = Date.now();
        break;
      case STATE.MOVING:    
        this.isMouseIdle = false;
        this.isSurprised = false;
        this.isJumping = false;
        break;
    }

    updatePetAppearance();
  }

  setIdlingSleepTimer() {
    if (this.idlingTimer) clearTimeout(this.idlingTimer);
    this.idlingTimer = setTimeout(() => {
      this.transition(STATE.SLEEPING);
    }, 1500);
  }

  changeMood(newMood) {
    if (this.mood === newMood) return;
    this.mood = newMood;
    if (newMood === MOOD.HAPPY) {
      if (this.state === STATE.SLEEPING) {
        this.transition(STATE.IDLING);
      }
      if (this.state === STATE.IDLING && this.idlingTimer) {
        clearTimeout(this.idlingTimer);
        this.idlingTimer = null;
      }
    } else if (newMood === MOOD.CALM) {
      if (this.state === STATE.MOVING) {
        this.transition(STATE.IDLE);
      }
      if (this.state === STATE.IDLING) {
        this.setIdlingSleepTimer();
      }
    }
  }

  handleMouseMove(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (this.mood === MOOD.CALM || isDragging) return;
    targetX = e.clientX;
    targetY = e.clientY;

    this.isMouseIdle = false;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    this.idleTimer = setTimeout(() => {
      this.isMouseIdle = true;
    }, MOUSE_IDLE_DELAY);

    if (this.state === STATE.SLEEPING) {
      this.transition(STATE.IDLING);
      return;
    }

    if (this.state === STATE.IDLING) {
      this.transition(STATE.MOVING);
      return;
    }

    if (this.state !== STATE.MOVING) {
      this.transition(STATE.MOVING);
    }
  }

  handleMouseClick(e) {
    if (this.state !== STATE.SLEEPING) return;
    const catCenterX = petX + PET_WIDTH / 2;
    const catCenterY = petY + PET_HEIGHT / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - catCenterX, 2) + Math.pow(e.clientY - catCenterY, 2)
    );

    if (distance <= 50) {
      removeZZZ()
      const sleepDuration = this.sleepStartTime
        ? (Date.now() - this.sleepStartTime) / 1000
        : 0;
      this.surprisedMode = sleepDuration >= 15 ? 2 : 1;
      this.isSurprised = true;
      this.frame = 0;

      if (this.surprisedMode === 2) {
        this.isJumping = true;
        this.jumpY = JUMP_INITIAL_HEIGHT;
        this.jumpV = 0;
      }
      updatePetAppearance();
      setTimeout(() => {
        this.transition(STATE.IDLE);
      }, 1000);
    }
  }

  updateFrame() {
    if (this.isSurprised) {
      if (this.surprisedMode === 1) {
        this.frame = (this.frame + 1) % 2;
      } else if (this.surprisedMode === 2 && this.isJumping) {
        this.jumpV += JUMP_GRAVITY;
        this.jumpY += this.jumpV;
        if (this.jumpY >= 0) {
          this.jumpY = 0;
          this.isJumping = false;
        }
      }
    } else if (this.state !== STATE.MOVING) {
      this.frame = (this.frame + 1) % 2;
    } else {
      this.frame = (this.frame + 1) % 2;
    }

    updatePetAppearance();
  }

  scheduleMoodChange() {
    if (this.moodTimer) clearTimeout(this.moodTimer);
    const nextInMs =
      MOOD_CHANGE_MIN + Math.random() * (MOOD_CHANGE_MAX - MOOD_CHANGE_MIN);
    this.moodTimer = setTimeout(() => {
      const newMood = Math.random() < 0.5 ? MOOD.HAPPY : MOOD.CALM;
      this.changeMood(newMood);
      this.scheduleMoodChange();
    }, nextInMs);
  }
}

// Initialize state machine
const catState = new CatStateMachine();

// Drag functionality
function startDrag(e) {
  if (catState.state !== STATE.SLEEPING) return;
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragStartPetX = petX;
  dragStartPetY = petY;
  dragStartEvent = e;
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
  updateCursor();
}

function drag(e) {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;

  if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
    petX = dragStartPetX + dx;
    petY = dragStartPetY + dy;
    const pos = clampToScreen(petX, petY);
    petX = pos.x;
    petY = pos.y;
    targetX = petX;
    targetY = petY;
    updatePetAppearance();
  }
  updateCursor();
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", endDrag);

  if (dragStartEvent) {
    const dx = Math.abs(dragStartEvent.clientX - dragStartEvent.clientX);
    const dy = Math.abs(dragStartEvent.clientY - dragStartEvent.clientY);
    if (dx <= DRAG_THRESHOLD && dy <= DRAG_THRESHOLD) {
      catState.handleMouseClick(dragStartEvent);
    }
    dragStartEvent = null;
  }
  updateCursor();
}

function updateCursor() {
  if (catState.state === STATE.IDLE) {
    document.body.style.cursor = "none";
  } else if (isDragging) {
    document.body.style.cursor = "grabbing";
  } else if (catState.state === STATE.SLEEPING) {
    // Check if mouse is over the cat
    const isOverCat =
      lastMouseX >= petX &&
      lastMouseX <= petX + PET_WIDTH &&
      lastMouseY >= petY &&
      lastMouseY <= petY + PET_HEIGHT;

    document.body.style.cursor = isOverCat ? "grab" : "auto";
  } else {
    document.body.style.cursor = "auto";
  }
}

function updatePetAppearance() {
  let shakeX = 0,
    shakeY = 0,
    offsetY = 0;
  let useScratch = false;
  let scratchArr = null;

  if (catState.state === STATE.MOVING) {
    if (petX <= 0 && catState.direction === DIRECTION.LEFT) {
      useScratch = true;
      scratchArr = arr_pageNeko_scratch_left;
    } else if (
      petX >= window.innerWidth - PET_WIDTH &&
      catState.direction === DIRECTION.RIGHT
    ) {
      useScratch = true;
      scratchArr = arr_pageNeko_scratch_right;
    } else if (petY <= 0 && catState.direction === DIRECTION.UP) {
      useScratch = true;
      scratchArr = arr_pageNeko_scratch_up;
    } else if (
      petY >= window.innerHeight - PET_HEIGHT &&
      catState.direction === DIRECTION.DOWN
    ) {
      useScratch = true;
      scratchArr = arr_pageNeko_scratch_down;
    }
  }

  // Get image from preloader
  let currentImage = null;
  if (catState.isSurprised) {
    if (catState.surprisedMode === 1) {
      shakeX = (Math.random() - 0.5) * 10;
      shakeY = (Math.random() - 0.5) * 10;
      const animation = arr_pageNeko_surprised;
      currentImage = animation[catState.frame % animation.length];
    } else if (catState.surprisedMode === 2) {
      offsetY = catState.jumpY;
      currentImage = arr_pageNeko_surprised[0];
    }
  } else if (catState.state === STATE.SLEEPING) {
    const animation = arr_pageNeko_sleeping;
    currentImage = animation[catState.frame % animation.length];
  } else if (catState.state === STATE.IDLING) {
    const animation = arr_pageNeko_idling;
    currentImage = animation[catState.frame % animation.length];
  } else if (catState.state === STATE.IDLE) {
    const animation = arr_pageNeko_idle;
    currentImage = animation[catState.frame % animation.length];
  } else if (catState.state === STATE.MOVING && useScratch) {
    const animation = scratchArr;
    currentImage = animation[catState.frame % animation.length];
  } else {
    const animation = directionAnimations[catState.direction];
    currentImage = animation[catState.frame % animation.length];
  }

  // Use preloaded image or fallback
  const imgPath = str_pageNeko_directory + currentImage;
  const img = preloadImages.get(imgPath);

  if (img) {
    petElement.style.backgroundImage = `url('${img.src}')`;
    petElement.style.backgroundColor = "transparent";
    petElement.style.border = "none";
  } else {
    // Fallback styling if image fails to load
    petElement.style.backgroundImage = "none";
    petElement.style.backgroundColor = "#f0f0f0";
    petElement.style.border = "1px dashed #ccc";
  }

  petElement.style.left = `${petX + shakeX}px`;
  petElement.style.top = `${petY + shakeY + offsetY}px`;
  updateCursor();
}

function clampToScreen(x, y) {
  return {
    x: Math.max(0, Math.min(window.innerWidth - PET_WIDTH, x)),
    y: Math.max(0, Math.min(window.innerHeight - PET_HEIGHT, y)),
  };
}

function updatePosition() {
  if (catState.mood === MOOD.CALM || isDragging) {
    requestAnimationFrame(updatePosition);
    return;
  }

  const dx = targetX - petX - PET_WIDTH / 2;
  const dy = targetY - petY - PET_HEIGHT / 2;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1 && catState.state === STATE.MOVING) {
    catState.direction = calculateDirection(dx, dy);
    petX += (dx / distance) * Math.min(PET_SPEED, distance);
    petY += (dy / distance) * Math.min(PET_SPEED, distance);
    const pos = clampToScreen(petX, petY);
    petX = pos.x;
    petY = pos.y;
  }

  if (
    distance < CATCH_DISTANCE &&
    catState.isMouseIdle &&
    catState.state === STATE.MOVING
  ) {
    catState.transition(STATE.IDLE);
  }

  requestAnimationFrame(updatePosition);
}

function calculateDirection(dx, dy) {
  const angle = Math.atan2(dy, dx);
  const degree = angle * (180 / Math.PI);
  const normalizedDegree = (degree + 360) % 360;

  if (normalizedDegree >= 337.5 || normalizedDegree < 22.5)
    return DIRECTION.RIGHT;
  if (normalizedDegree >= 22.5 && normalizedDegree < 67.5)
    return DIRECTION.DOWN_RIGHT;
  if (normalizedDegree >= 67.5 && normalizedDegree < 112.5)
    return DIRECTION.DOWN;
  if (normalizedDegree >= 112.5 && normalizedDegree < 157.5)
    return DIRECTION.DOWN_LEFT;
  if (normalizedDegree >= 157.5 && normalizedDegree < 202.5)
    return DIRECTION.LEFT;
  if (normalizedDegree >= 202.5 && normalizedDegree < 247.5)
    return DIRECTION.UP_LEFT;
  if (normalizedDegree >= 247.5 && normalizedDegree < 292.5)
    return DIRECTION.UP;
  if (normalizedDegree >= 292.5 && normalizedDegree < 337.5)
    return DIRECTION.UP_RIGHT;
  return DIRECTION.DOWN;
}

// Initialize after images are preloaded
function initAfterPreload() {
  petX = Math.random() * (window.innerWidth - PET_WIDTH);
  petY = Math.random() * (window.innerHeight - PET_HEIGHT);
  targetX = petX;
  targetY = petY;
  catState.mood = Math.random() < 0.5 ? MOOD.HAPPY : MOOD.CALM;

  if (catState.mood === MOOD.CALM) {
    catState.transition(STATE.SLEEPING);
  } else {
    catState.transition(STATE.MOVING);
  }

  petElement.style.display = "block";

  document.addEventListener("mousemove", (e) => {
    catState.handleMouseMove(e);
  });

  document.addEventListener("mousedown", (e) => {
    const catCenterX = petX + PET_WIDTH / 2;
    const catCenterY = petY + PET_HEIGHT / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - catCenterX, 2) + Math.pow(e.clientY - catCenterY, 2)
    );

    if (catState.state === STATE.SLEEPING && distance <= 50) {
      startDrag(e);
    } else {
      catState.handleMouseClick(e);
    }
  });

  catState.frameInterval = setInterval(
    () => catState.updateFrame(),
    RUN_FRAME_INTERVAL
  );
  updatePosition();
  catState.scheduleMoodChange();
}

// Preload images and initialize
window.addEventListener("load", () => {
  // Show loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.textContent = "Loading cat images...";
  loadingIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        border-radius: 4px;
        z-index: 10000;
        font-family: sans-serif;
    `;
  document.body.appendChild(loadingIndicator);

  preloadImages.load(allImagePaths).then(() => {
    document.body.removeChild(loadingIndicator);
    initAfterPreload();
  });
});

// Window resize handler
window.addEventListener("resize", () => {
  const pos = clampToScreen(petX, petY);
  petX = pos.x;
  petY = pos.y;
  targetX = Math.min(window.innerWidth - PET_WIDTH, Math.max(0, targetX));
  targetY = Math.min(window.innerHeight - PET_HEIGHT, Math.max(0, targetY));
  updatePetAppearance();
});
