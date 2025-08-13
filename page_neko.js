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
const RUN_FRAME_INTERVAL = 280; // Run animation frame interval (ms)
const IDLE_TO_IDLING_DELAY = 1200; // Delay from idle to idling (ms)
const IDLING_FRAME_INTERVAL = 500; // Idling animation frame interval (ms)
const IDLING_REPEAT = 3; // Idling animation repeat count
const SLEEP_MATURE_TIME = 5000; // Time to mature sleep (ms)
const SURPRISED_FRAME_INTERVAL = 400; // Surprised animation frame interval (ms)
const SURPRISED_REPEAT = 2; // Surprised animation repeat count
const MOUSE_IDLE_DELAY = 500; // Mouse idle detection (ms)
const MOOD_CHANGE_MIN = 60000; // Mood change min interval (ms)
const MOOD_CHANGE_MAX = 120000; // Mood change max interval (ms)
const CATCH_DISTANCE = 5; // Distance to catch mouse

// Cat width and height
const PET_WIDTH = 42;
const PET_HEIGHT = 42;

// Position variables
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let petX = targetX;
let petY = targetY;

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
const DRAG_THRESHOLD = 5; // Drag threshold (pixels)
let dragStartEvent = null; // Save the drag start event

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
    // Clear current state timers
    if (this.state === STATE.IDLE && this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    } else if (this.state === STATE.IDLING && this.idlingTimer) {
      clearTimeout(this.idlingTimer);
      this.idlingTimer = null;
    }

    // Reset surprised flag on state transition
    this.isSurprised = false;
    this.isJumping = false;
    this.jumpY = 0;
    this.jumpV = 0;

    this.prevState = this.state;
    this.state = newState;
    this.frame = 0; // Reset animation frame

    // State transition handling
    switch (newState) {
      case STATE.IDLE:
        this.idleTimer = setTimeout(() => {
          this.transition(STATE.IDLING);
        }, IDLE_TO_IDLING_DELAY);
        break;

      case STATE.IDLING:
        this.idlingCount = 0;
        // Only in calm mood will enter sleep state
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

  // Set sleep timer for IDLING state
  setIdlingSleepTimer() {
    if (this.idlingTimer) clearTimeout(this.idlingTimer);
    this.idlingTimer = setTimeout(() => {
      this.transition(STATE.SLEEPING);
    }, 1500);
  }

  changeMood(newMood) {
    if (this.mood === newMood) return;

    this.mood = newMood;

    // Mood transition handling
    if (newMood === MOOD.HAPPY) {
      // Force wake up and enter moving state when happy
      if (this.state === STATE.SLEEPING) {
        this.transition(STATE.IDLING);
      }
      // If in IDLING state, clear sleep timer
      if (this.state === STATE.IDLING && this.idlingTimer) {
        clearTimeout(this.idlingTimer);
        this.idlingTimer = null;
      }
    } else if (newMood === MOOD.CALM) {
      // Enter idle state when calm
      if (this.state === STATE.MOVING) {
        this.transition(STATE.IDLE);
      }
      // If in IDLING state, set sleep timer
      if (this.state === STATE.IDLING) {
        this.setIdlingSleepTimer();
      }
    }
  }

  // Handle mouse move event
  handleMouseMove(e) {
    // Ignore mouse movement in CALM mood
    if (this.mood === MOOD.CALM || isDragging) return;

    targetX = e.clientX;
    targetY = e.clientY;

    // HAPPY mood handling
    this.isMouseIdle = false;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    // Set idle detection
    this.idleTimer = setTimeout(() => {
      this.isMouseIdle = true;
    }, MOUSE_IDLE_DELAY);

    // If currently in sleep state, need to wake up first
    if (this.state === STATE.SLEEPING) {
      this.transition(STATE.IDLING);
      return;
    }

    // Transition from IDLING state to MOVING state on mouse move
    if (this.state === STATE.IDLING) {
      this.transition(STATE.MOVING);
      return;
    }

    // Transition to moving state from other states
    if (this.state !== STATE.MOVING) {
      this.transition(STATE.MOVING);
    }
  }

  // Handle mouse click event
  handleMouseClick(e) {
    // Only handle in sleep state
    if (this.state !== STATE.SLEEPING) return;

    // 检查点击是否在猫咪附近（50像素范围内）
    const catCenterX = petX + PET_WIDTH / 2;
    const catCenterY = petY + PET_HEIGHT / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - catCenterX, 2) + Math.pow(e.clientY - catCenterY, 2)
    );

    // 如果点击在猫咪附近，才惊醒
    if (distance <= 50) {
      // Determine surprised mode
      const sleepDuration = this.sleepStartTime
        ? (Date.now() - this.sleepStartTime) / 1000
        : 0;
      this.surprisedMode = sleepDuration >= 15 ? 2 : 1;

      // Set surprised state
      this.isSurprised = true;
      this.frame = 0;

      // Jump mode initialization
      if (this.surprisedMode === 2) {
        this.isJumping = true;
        this.jumpY = JUMP_INITIAL_HEIGHT;
        this.jumpV = 0;
      }

      updatePetAppearance();

      // Transition to idle state (will return to idling and continue sleeping in calm mood)
      setTimeout(() => {
        this.transition(STATE.IDLE);
      }, 1000);
    }
  }

  // Update animation frame
  updateFrame() {
    if (this.isSurprised) {
      if (this.surprisedMode === 1) {
        // Shaking mode
        this.frame = (this.frame + 1) % 2;
      } else if (this.surprisedMode === 2 && this.isJumping) {
        // Jumping mode
        this.jumpV += JUMP_GRAVITY;
        this.jumpY += this.jumpV;

        if (this.jumpY >= 0) {
          this.jumpY = 0;
          this.isJumping = false;
        }
      }
    } else if (this.state !== STATE.MOVING) {
      // Non-moving state animation
      this.frame = (this.frame + 1) % 2;
    } else {
      // Moving state animation (slightly faster)
      this.frame = (this.frame + 1) % 2;
    }

    updatePetAppearance();
  }

  // Schedule mood change
  scheduleMoodChange() {
    if (this.moodTimer) clearTimeout(this.moodTimer);

    // Change to 1~2 minutes
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

// Create cat element with styles
const petElement = document.createElement("div");
petElement.id = "neko";
// Apply all necessary styles directly
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
  display: "none", // Initially hidden
});
document.body.appendChild(petElement);

// Drag functionality
function startDrag(e) {
  if (catState.state !== STATE.SLEEPING) return;

  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragStartPetX = petX;
  dragStartPetY = petY;
  dragStartEvent = e; // Save the event object

  // Add event listeners
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);

  // Immediately update cursor
  updateCursor();
}

function drag(e) {
  if (!isDragging) return;

  // Calculate movement distance
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;

  // Check if drag threshold is reached
  if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
    // Update cat position
    petX = dragStartPetX + dx;
    petY = dragStartPetY + dy;

    // Boundary check
    const pos = clampToScreen(petX, petY);
    petX = pos.x;
    petY = pos.y;

    // Update target position to current position
    targetX = petX;
    targetY = petY;

    // Update appearance
    updatePetAppearance();
  }

  // Update cursor
  updateCursor();
}

function endDrag() {
  if (!isDragging) return;

  isDragging = false;

  // Remove event listeners
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", endDrag);

  // Check if it was just a click (no drag)
  const dx = Math.abs(dragStartEvent.clientX - dragStartEvent.clientX);
  const dy = Math.abs(dragStartEvent.clientY - dragStartEvent.clientY);

  if (dx <= DRAG_THRESHOLD && dy <= DRAG_THRESHOLD) {
    // This is a click rather than a drag, trigger wake-up
    catState.handleMouseClick(dragStartEvent);
  }

  dragStartEvent = null;

  // Update cursor
  updateCursor();
}

// Unified cursor update function
function updateCursor() {
  if (catState.state === STATE.IDLE) {
    // Idle state: hide cursor
    document.body.style.cursor = "none";
  } else if (catState.state === STATE.SLEEPING) {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "grab";
    }
  } else {
    // Other states: default cursor
    document.body.style.cursor = "auto";
  }
}

// Update cat appearance
function updatePetAppearance() {
  let shakeX = 0,
    shakeY = 0,
    offsetY = 0;

  // Determine whether to use scratch image or normal direction image based on wall collision
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

  if (catState.isSurprised) {
    if (catState.surprisedMode === 1) {
      // Shaking mode
      shakeX = (Math.random() - 0.5) * 10;
      shakeY = (Math.random() - 0.5) * 10;
      const animation = arr_pageNeko_surprised;
      petElement.style.backgroundImage = `url('${str_pageNeko_directory}${
        animation[catState.frame % animation.length]
      }')`;
    } else if (catState.surprisedMode === 2) {
      // Jumping mode
      offsetY = catState.jumpY;
      petElement.style.backgroundImage = `url('${str_pageNeko_directory}${arr_pageNeko_surprised[0]}')`;
    }
  } else if (catState.state === STATE.SLEEPING) {
    const animation = arr_pageNeko_sleeping;
    petElement.style.backgroundImage = `url('${str_pageNeko_directory}${
      animation[catState.frame % animation.length]
    }')`;
  } else if (catState.state === STATE.IDLING) {
    const animation = arr_pageNeko_idling;
    petElement.style.backgroundImage = `url('${str_pageNeko_directory}${
      animation[catState.frame % animation.length]
    }')`;
  } else if (catState.state === STATE.IDLE) {
    const animation = arr_pageNeko_idle;
    petElement.style.backgroundImage = `url('${str_pageNeko_directory}${
      animation[catState.frame % animation.length]
    }')`;
  } else if (catState.state === STATE.MOVING && useScratch) {
    const animation = scratchArr;
    petElement.style.backgroundImage = `url('${str_pageNeko_directory}${
      animation[catState.frame % animation.length]
    }')`;
  } else {
    const animation = directionAnimations[catState.direction];
    petElement.style.backgroundImage = `url('${str_pageNeko_directory}${
      animation[catState.frame % animation.length]
    }')`;
  }

  petElement.style.left = `${petX + shakeX}px`;
  petElement.style.top = `${petY + shakeY + offsetY}px`;

  // Update cursor
  updateCursor();
}

// Boundary detection
function clampToScreen(x, y) {
  return {
    x: Math.max(0, Math.min(window.innerWidth - PET_WIDTH, x)),
    y: Math.max(0, Math.min(window.innerHeight - PET_HEIGHT, y)),
  };
}

// Update position
function updatePosition() {
  // Do not move in CALM mood or when dragging
  if (catState.mood === MOOD.CALM || isDragging) {
    requestAnimationFrame(updatePosition);
    return;
  }

  // Calculate distance
  const dx = targetX - petX - PET_WIDTH / 2;
  const dy = targetY - petY - PET_HEIGHT / 2;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Movement handling
  if (distance > 1 && catState.state === STATE.MOVING) {
    catState.direction = calculateDirection(dx, dy);
    petX += (dx / distance) * Math.min(PET_SPEED, distance);
    petY += (dy / distance) * Math.min(PET_SPEED, distance);

    // Boundary check
    const pos = clampToScreen(petX, petY);
    petX = pos.x;
    petY = pos.y;
  }

  // Check if need to transition to idle state
  if (
    distance < CATCH_DISTANCE &&
    catState.isMouseIdle &&
    catState.state === STATE.MOVING
  ) {
    catState.transition(STATE.IDLE);
  }

  requestAnimationFrame(updatePosition);
}

// Calculate direction
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

// Initialize
function init() {
  // Set initial position
  petX = Math.random() * (window.innerWidth - PET_WIDTH);
  petY = Math.random() * (window.innerHeight - PET_HEIGHT);
  targetX = petX;
  targetY = petY;

  // Initial mood and state
  catState.mood = Math.random() < 0.5 ? MOOD.HAPPY : MOOD.CALM;

  if (catState.mood === MOOD.CALM) {
    catState.transition(STATE.SLEEPING);
  } else {
    catState.transition(STATE.MOVING);
  }

  // Show cat element
  petElement.style.display = "block";

  // Add event listeners
  document.addEventListener("mousemove", (e) => {
    catState.handleMouseMove(e);
  });

  document.addEventListener("mousedown", (e) => {
    // Check if the mouse is near the cat (within 50 pixels)
    const catCenterX = petX + PET_WIDTH / 2;
    const catCenterY = petY + PET_HEIGHT / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - catCenterX, 2) + Math.pow(e.clientY - catCenterY, 2)
    );

    if (catState.state === STATE.SLEEPING && distance <= 50) {
      startDrag(e);
    } else {
      // Handle clicks when not sleeping
      catState.handleMouseClick(e);
    }
  });

  // Start animation
  catState.frameInterval = setInterval(
    () => catState.updateFrame(),
    RUN_FRAME_INTERVAL
  );
  updatePosition();

  // Start mood system
  catState.scheduleMoodChange();
}

// Initialize after page load
window.addEventListener("load", () => {
  init();
});

// Reset position on window resize
window.addEventListener("resize", () => {
  // Update position to stay within new window bounds
  const pos = clampToScreen(petX, petY);
  petX = pos.x;
  petY = pos.y;

  // Also update target position to stay within bounds
  targetX = Math.min(window.innerWidth - PET_WIDTH, Math.max(0, targetX));
  targetY = Math.min(window.innerHeight - PET_HEIGHT, Math.max(0, targetY));

  updatePetAppearance();
});
