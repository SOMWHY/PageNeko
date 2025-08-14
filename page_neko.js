// =====================================
// Configuration Constants
// =====================================
const USE_CACHE = true;
const CACHE_VERSION = "v1";
const ENABLE_ZZZ_ANIMATION = true;

// Animation Constants
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
const PET_WIDTH = 42;
const PET_HEIGHT = 42;
const PET_SPEED = 0.8;
const DRAG_THRESHOLD = 5;
const JUMP_INITIAL_HEIGHT = -30;
const JUMP_GRAVITY = 2;
const ZZZ_FONT_SIZE_MIN = 14;
const ZZZ_FONT_SIZE_MAX = 22;
const ZZZ_OFFSET_X_RANGE = 20;
const ZZZ_OFFSET_Y_RANGE = 10;
const ZZZ_ANIMATION_DURATION = 1000;
const ZZZ_ANIMATION_VARIANCE = 1500;
const ZZZ_TRANSLATE_Y = -40;
const ZZZ_TRANSLATE_X = 20;
const ZZZ_REMOVE_DELAY = 500;
const SHAKE_INTENSITY = 10;
const SLEEP_CLICK_DISTANCE = 50;
const SLEEP_CLICK_DURATION = 15;
const FALLBACK_SIZE = 42;

// Direction Constants
const DIRECTION = {
  DOWN: 0,
  DOWN_LEFT: 1,
  LEFT: 2,
  UP_LEFT: 3,
  UP: 4,
  UP_RIGHT: 5,
  RIGHT: 6,
  DOWN_RIGHT: 7
};

// State Constants
const STATE = {
  MOVING: 0,
  IDLE: 1,
  IDLING: 2,
  SLEEPING: 3
};

// Mood Constants
const MOOD = {
  HAPPY: 0,
  CALM: 1
};

// =====================================
// Global Variables
// =====================================
let isZZZAnimationActive = false;
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let petX = targetX;
let petY = targetY;
let lastMouseX = 0;
let lastMouseY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartPetX = 0;
let dragStartPetY = 0;
let dragStartEvent = null;

// =====================================
// DOM Elements
// =====================================
const zzzContainer = document.createElement("div");
zzzContainer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9998;
`;
document.body.appendChild(zzzContainer);

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
  backgroundColor: "#f0f0f0",
  border: "1px dashed #ccc"
});
document.body.appendChild(petElement);

// =====================================
// Image Preloader
// =====================================
const preloadImages = (() => {
  const images = {};
  const loadedImages = new Set();
  const storagePrefix = `neko_img_${CACHE_VERSION}_`;

  function createFallbackElement(path) {
    const fallback = document.createElement("div");
    fallback.style.cssText = `
      position: absolute;
      width: ${FALLBACK_SIZE}px;
      height: ${FALLBACK_SIZE}px;
      background-color: #ff6b6b;
      color: white;
      font-size: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      z-index: ${parseInt(petElement.style.zIndex, 10) - 1};
    `;
    fallback.textContent = path.split("/").pop().replace(".png", "");
    document.body.appendChild(fallback);
    return fallback;
  }

  function loadFromNetwork(img, path, resolve) {
    img.onload = () => {
      images[path] = img;
      loadedImages.add(path);
      cacheImage(img, path);
      resolve();
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${path}`);
      createFallbackElement(path);
      resolve();
    };

    img.src = path;
  }

  function cacheImage(img, path) {
    if (!USE_CACHE) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const storageKey = storagePrefix + path.replace(/\//g, "_");
      localStorage.setItem(storageKey, canvas.toDataURL("image/png"));
    } catch (e) {
      console.error("Caching failed:", e);
    }
  }

  function createImageLoadPromise(path) {
    return new Promise(resolve => {
      if (loadedImages.has(path)) {
        resolve();
        return;
      }

      const storageKey = storagePrefix + path.replace(/\//g, "_");
      const img = new Image();

      // Try to load from cache
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
            loadFromNetwork(img, path, resolve);
          };
        } catch (e) {
          console.error("Cache load error:", e);
          loadFromNetwork(img, path, resolve);
        }
      } else {
        loadFromNetwork(img, path, resolve);
      }
    });
  }

  return {
    load: function(paths) {
      const newPaths = paths.filter(path => !loadedImages.has(path));
      const promises = newPaths.map(path => createImageLoadPromise(path));
      return Promise.all(promises);
    },
    get: function(path) {
      return images[path];
    },
    clearCache: function() {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
    }
  };
})();

// =====================================
// ZZZ Animation Functions
// =====================================
function createZZZElement() {
  const zzz = document.createElement("div");
  const zCount = 1 + Math.floor(Math.random() * 3);
  zzz.textContent = "z".repeat(zCount);
  
  const fontSize = ZZZ_FONT_SIZE_MIN + Math.random() * (ZZZ_FONT_SIZE_MAX - ZZZ_FONT_SIZE_MIN);
  
  zzz.style.cssText = `
    position: absolute;
    color: rgba(150, 150, 150, 0.7);
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: ${fontSize}px;
    opacity: 0;
    transition: opacity 0.5s, transform 2s ease-out;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  `;
  
  return zzz;
}

function animateZZZ() {
  if (!isZZZAnimationActive || !ENABLE_ZZZ_ANIMATION) {
    removeZZZ();
    return;
  }

  const zzz = createZZZElement();
  
  // Position above the sleeping cat
  const catHeadX = petX + PET_WIDTH / 2;
  const catHeadY = petY + PET_HEIGHT * 0.2;
  const offsetX = (Math.random() - 0.5) * ZZZ_OFFSET_X_RANGE;
  const offsetY = -Math.random() * ZZZ_OFFSET_Y_RANGE;

  zzz.style.left = `${catHeadX + offsetX}px`;
  zzz.style.top = `${catHeadY + offsetY}px`;
  zzz.style.opacity = "1";
  zzzContainer.appendChild(zzz);

  // Animate upward movement
  setTimeout(() => {
    zzz.style.opacity = "0";
    zzz.style.transform = `translateY(${ZZZ_TRANSLATE_Y}px) translateX(${ZZZ_TRANSLATE_X}px)`;

    // Remove element after animation
    setTimeout(() => {
      if (zzz.parentNode === zzzContainer) {
        zzzContainer.removeChild(zzz);
      }
    }, ZZZ_REMOVE_DELAY);
  }, 100);

  // Schedule next ZZZ
  setTimeout(animateZZZ, ZZZ_ANIMATION_DURATION + Math.random() * ZZZ_ANIMATION_VARIANCE);
}

function removeZZZ() {
  isZZZAnimationActive = false;
  zzzContainer.textContent = '';
}

// =====================================
// Image Configuration
// =====================================
const str_pageNeko_directory = "images_neko/";

// Animation frame arrays
const animationFrames = {
  down: ["CUR_DOWN_FRAME01.png", "CUR_DOWN_FRAME02.png"],
  downLeft: ["CUR_DOWN_LEFT_FRAME01.png", "CUR_DOWN_LEFT_FRAME02.png"],
  downRight: ["CUR_DOWN_RIGHT_FRAME01.png", "CUR_DOWN_RIGHT_FRAME02.png"],
  left: ["CUR_LEFT_FRAME01.png", "CUR_LEFT_FRAME02.png"],
  right: ["CUR_RIGHT_FRAME01.png", "CUR_RIGHT_FRAME02.png"],
  up: ["CUR_UP_FRAME01.png", "CUR_UP_FRAME02.png"],
  upLeft: ["CUR_UP_LEFT_FRAME01.png", "CUR_UP_LEFT_FRAME02.png"],
  upRight: ["CUR_UP_RIGHT_FRAME01.png", "CUR_UP_RIGHT_FRAME02.png"],
  surprised: ["CUR_SURPRISE_FRAME01.png", "CUR_SURPRISE_FRAME02.png"],
  idle: ["CUR_IDLE_FRAME01.png", "CUR_IDLE_FRAME02.png"],
  idling: ["CUR_IDLING_FRAME01.png", "CUR_IDLING_FRAME02.png"],
  sleepStart: ["CUR_SLEEPSTART_FRAME01.png", "CUR_SLEEPSTART_FRAME02.png"],
  sleeping: ["CUR_SLEEP_FRAME01.png", "CUR_SLEEP_FRAME02.png"],
  scratchDown: ["CUR_SCRATCH_DOWN_FRAME01.png", "CUR_SCRATCH_DOWN_FRAME02.png"],
  scratchLeft: ["CUR_SCRATCH_LEFT_FRAME01.png", "CUR_SCRATCH_LEFT_FRAME02.png"],
  scratchRight: ["CUR_SCRATCH_RIGHT_FRAME01.png", "CUR_SCRATCH_RIGHT_FRAME02.png"],
  scratchUp: ["CUR_SCRATCH_UP_FRAME01.png", "CUR_SCRATCH_UP_FRAME02.png"]
};

// Direction to animation mapping
const directionAnimations = {
  [DIRECTION.DOWN]: animationFrames.down,
  [DIRECTION.DOWN_LEFT]: animationFrames.downLeft,
  [DIRECTION.LEFT]: animationFrames.left,
  [DIRECTION.UP_LEFT]: animationFrames.upLeft,
  [DIRECTION.UP]: animationFrames.up,
  [DIRECTION.UP_RIGHT]: animationFrames.upRight,
  [DIRECTION.RIGHT]: animationFrames.right,
  [DIRECTION.DOWN_RIGHT]: animationFrames.downRight
};

// Collect all image paths for preloading
const allImagePaths = Object.values(animationFrames)
  .flat()
  .map(img => str_pageNeko_directory + img);

// =====================================
// Cat State Machine
// =====================================
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
    removeZZZ();
    
    // Clear any existing timers
    this.clearTimers();
    
    this.isSurprised = false;
    this.isJumping = false;
    this.jumpY = 0;
    this.jumpV = 0;

    this.prevState = this.state;
    this.state = newState;
    this.frame = 0;

    // Handle state-specific logic
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
        isZZZAnimationActive = true;
        if (ENABLE_ZZZ_ANIMATION) {
          animateZZZ();
        }
        break;
      case STATE.MOVING:
        this.isMouseIdle = false;
        this.isSurprised = false;
        this.isJumping = false;
        break;
    }

    updatePetAppearance();
  }

  clearTimers() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.idlingTimer) clearTimeout(this.idlingTimer);
    this.idleTimer = null;
    this.idlingTimer = null;
  }

  setIdlingSleepTimer() {
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
      this.clearTimers();
    } else if (newMood === MOOD.CALM) {
      if (this.state === STATE.MOVING) {
        this.transition(STATE.IDLE);
      } else if (this.state === STATE.IDLING) {
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

    // Reset idle timer
    this.clearTimers();
    this.idleTimer = setTimeout(() => {
      this.isMouseIdle = true;
    }, MOUSE_IDLE_DELAY);

    // Handle state transitions based on mouse movement
    if (this.state === STATE.SLEEPING) {
      this.transition(STATE.IDLING);
    } else if (this.state === STATE.IDLING) {
      this.transition(STATE.MOVING);
    } else if (this.state !== STATE.MOVING) {
      this.transition(STATE.MOVING);
    }
  }

  handleMouseClick(e) {
    if (this.state !== STATE.SLEEPING) return;
    
    const catCenterX = petX + PET_WIDTH / 2;
    const catCenterY = petY + PET_HEIGHT / 2;
    const distance = calculateDistance(e.clientX, e.clientY, catCenterX, catCenterY);

    if (distance <= SLEEP_CLICK_DISTANCE) {
      removeZZZ();
      const sleepDuration = this.sleepStartTime ? 
        (Date.now() - this.sleepStartTime) / 1000 : 0;
      
      this.surprisedMode = sleepDuration >= SLEEP_CLICK_DURATION ? 2 : 1;
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
      this.handleSurprisedFrame();
    } else if (this.state !== STATE.MOVING) {
      this.frame = (this.frame + 1) % 2;
    } else {
      this.frame = (this.frame + 1) % 2;
    }

    updatePetAppearance();
  }

  handleSurprisedFrame() {
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
  }

  scheduleMoodChange() {
    if (this.moodTimer) clearTimeout(this.moodTimer);
    
    const nextInMs = MOOD_CHANGE_MIN + 
      Math.random() * (MOOD_CHANGE_MAX - MOOD_CHANGE_MIN);
    
    this.moodTimer = setTimeout(() => {
      const newMood = Math.random() < 0.5 ? MOOD.HAPPY : MOOD.CALM;
      this.changeMood(newMood);
      this.scheduleMoodChange();
    }, nextInMs);
  }
}

// Initialize state machine
const catState = new CatStateMachine();

// =====================================
// Drag Handling Functions
// =====================================
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

// =====================================
// Utility Functions
// =====================================
function calculateDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function clampToScreen(x, y) {
  return {
    x: Math.max(0, Math.min(window.innerWidth - PET_WIDTH, x)),
    y: Math.max(0, Math.min(window.innerHeight - PET_HEIGHT, y))
  };
}

function calculateDirection(dx, dy) {
  const angle = Math.atan2(dy, dx);
  const degree = angle * (180 / Math.PI);
  const normalizedDegree = (degree + 360) % 360;

  if (normalizedDegree >= 337.5 || normalizedDegree < 22.5) return DIRECTION.RIGHT;
  if (normalizedDegree >= 22.5 && normalizedDegree < 67.5) return DIRECTION.DOWN_RIGHT;
  if (normalizedDegree >= 67.5 && normalizedDegree < 112.5) return DIRECTION.DOWN;
  if (normalizedDegree >= 112.5 && normalizedDegree < 157.5) return DIRECTION.DOWN_LEFT;
  if (normalizedDegree >= 157.5 && normalizedDegree < 202.5) return DIRECTION.LEFT;
  if (normalizedDegree >= 202.5 && normalizedDegree < 247.5) return DIRECTION.UP_LEFT;
  if (normalizedDegree >= 247.5 && normalizedDegree < 292.5) return DIRECTION.UP;
  if (normalizedDegree >= 292.5 && normalizedDegree < 337.5) return DIRECTION.UP_RIGHT;
  return DIRECTION.DOWN;
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
  let shakeX = 0, shakeY = 0, offsetY = 0;
  let animation = null;

  // Handle scratching animations when hitting screen edges
  if (catState.state === STATE.MOVING) {
    if (petX <= 0 && catState.direction === DIRECTION.LEFT) {
      animation = animationFrames.scratchLeft;
    } else if (petX >= window.innerWidth - PET_WIDTH && 
               catState.direction === DIRECTION.RIGHT) {
      animation = animationFrames.scratchRight;
    } else if (petY <= 0 && catState.direction === DIRECTION.UP) {
      animation = animationFrames.scratchUp;
    } else if (petY >= window.innerHeight - PET_HEIGHT && 
               catState.direction === DIRECTION.DOWN) {
      animation = animationFrames.scratchDown;
    }
  }

  // Select appropriate animation based on state
  if (!animation) {
    if (catState.isSurprised) {
      animation = animationFrames.surprised;
      if (catState.surprisedMode === 1) {
        shakeX = (Math.random() - 0.5) * SHAKE_INTENSITY;
        shakeY = (Math.random() - 0.5) * SHAKE_INTENSITY;
      } else if (catState.surprisedMode === 2) {
        offsetY = catState.jumpY;
      }
    } else {
      switch (catState.state) {
        case STATE.SLEEPING: animation = animationFrames.sleeping; break;
        case STATE.IDLING: animation = animationFrames.idling; break;
        case STATE.IDLE: animation = animationFrames.idle; break;
        case STATE.MOVING: animation = directionAnimations[catState.direction]; break;
      }
    }
  }

  // Get current frame
  const currentFrame = animation[catState.frame % animation.length];
  const imgPath = str_pageNeko_directory + currentFrame;
  const img = preloadImages.get(imgPath);

  // Apply styling
  if (img) {
    petElement.style.backgroundImage = `url('${img.src}')`;
    petElement.style.backgroundColor = "transparent";
    petElement.style.border = "none";
  } else {
    // Fallback styling
    petElement.style.backgroundImage = "none";
    petElement.style.backgroundColor = "#f0f0f0";
    petElement.style.border = "1px dashed #ccc";
  }

  petElement.style.left = `${petX + shakeX}px`;
  petElement.style.top = `${petY + shakeY + offsetY}px`;
  updateCursor();
}

// =====================================
// Position Update Logic
// =====================================
function updatePosition() {
  if (catState.mood === MOOD.CALM || isDragging) {
    requestAnimationFrame(updatePosition);
    return;
  }

  const catCenterX = petX + PET_WIDTH / 2;
  const catCenterY = petY + PET_HEIGHT / 2;
  const dx = targetX - catCenterX;
  const dy = targetY - catCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1 && catState.state === STATE.MOVING) {
    catState.direction = calculateDirection(dx, dy);
    petX += (dx / distance) * Math.min(PET_SPEED, distance);
    petY += (dy / distance) * Math.min(PET_SPEED, distance);
    const pos = clampToScreen(petX, petY);
    petX = pos.x;
    petY = pos.y;
  }

  if (distance < CATCH_DISTANCE && 
      catState.isMouseIdle && 
      catState.state === STATE.MOVING) {
    catState.transition(STATE.IDLE);
  }

  requestAnimationFrame(updatePosition);
}

// =====================================
// Initialization Functions
// =====================================
function initAfterPreload() {
  // Initialize random position
  petX = Math.random() * (window.innerWidth - PET_WIDTH);
  petY = Math.random() * (window.innerHeight - PET_HEIGHT);
  targetX = petX;
  targetY = petY;
  
  // Set initial mood
  catState.mood = Math.random() < 0.5 ? MOOD.HAPPY : MOOD.CALM;
  catState.transition(catState.mood === MOOD.CALM ? STATE.SLEEPING : STATE.MOVING);
  
  petElement.style.display = "block";

  // Event listeners
  document.addEventListener("mousemove", e => catState.handleMouseMove(e));
  
  document.addEventListener("mousedown", e => {
    const catCenterX = petX + PET_WIDTH / 2;
    const catCenterY = petY + PET_HEIGHT / 2;
    const distance = calculateDistance(e.clientX, e.clientY, catCenterX, catCenterY);

    if (catState.state === STATE.SLEEPING && distance <= SLEEP_CLICK_DISTANCE) {
      startDrag(e);
    } else {
      catState.handleMouseClick(e);
    }
  });

  // Start animation loop
  catState.frameInterval = setInterval(
    () => catState.updateFrame(),
    RUN_FRAME_INTERVAL
  );
  
  // Start position updates
  updatePosition();
  
  // Schedule mood changes
  catState.scheduleMoodChange();
}

// =====================================
// Startup Logic
// =====================================
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

  // Preload images and initialize
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