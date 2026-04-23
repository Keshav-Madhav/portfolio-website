"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * SpiritGuide — a living, breathing companion orb with emotional personality.
 *
 * This orb feels ALIVE through:
 *   1. Emotional state system — colors shift based on user interaction
 *   2. Spring physics — smooth, fluid movement with proper mass/damping
 *   3. Perlin noise — organic, never-repeating wandering paths
 *   4. Breathing animation — layered oscillations for constant subtle motion
 *   5. Pet personality — responds to cursor proximity with joy/sadness
 *
 * Emotions:
 *   calm     (cyan)   — default resting state
 *   happy    (yellow) — cursor approaches or moves with orb
 *   curious  (purple) — exploring guide items
 *   sad      (blue)   — cursor moves away or leaves
 *   excited  (bright) — arrives at guide item
 *   startled (white)  — fast scroll
 *
 * Movement is SLOW, SMOOTH, and FLUID — never jittery or rapid.
 */

// ============================================================================
// PERLIN NOISE - For organic, natural movement
// ============================================================================

class PerlinNoise {
  private perm: number[] = [];

  constructor(seed = Math.random() * 10000) {
    const p = [];
    for (let i = 0; i < 256; i++) p[i] = i;
    
    // Shuffle with seed
    let n = seed;
    for (let i = 255; i > 0; i--) {
      n = (n * 16807) % 2147483647;
      const j = n % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    
    this.perm = [...p, ...p];
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise3D(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(this.grad(this.perm[AA], x, y, z), this.grad(this.perm[BA], x - 1, y, z), u),
        this.lerp(this.grad(this.perm[AB], x, y - 1, z), this.grad(this.perm[BB], x - 1, y - 1, z), u),
        v
      ),
      this.lerp(
        this.lerp(this.grad(this.perm[AA + 1], x, y, z - 1), this.grad(this.perm[BA + 1], x - 1, y, z - 1), u),
        this.lerp(this.grad(this.perm[AB + 1], x, y - 1, z - 1), this.grad(this.perm[BB + 1], x - 1, y - 1, z - 1), u),
        v
      ),
      w
    );
  }
}

// ============================================================================
// EMOTION SYSTEM
// ============================================================================

type Emotion = "calm" | "happy" | "curious" | "sad" | "excited" | "startled" | "content";

interface EmotionConfig {
  hue: number;
  saturation: number;
  lightness: number;
  intensity: number;
}

const EMOTIONS: Record<Emotion, EmotionConfig> = {
  // Soft cyan-teal — tranquil, at peace
  calm:     { hue: 185, saturation: 88, lightness: 72, intensity: 0.9 },
  // Warm golden sunshine — joyful, playful  
  happy:    { hue: 48,  saturation: 95, lightness: 68, intensity: 1.15 },
  // Rich violet-purple — intrigued, wondering
  curious:  { hue: 280, saturation: 82, lightness: 72, intensity: 1.0 },
  // Deep melancholic blue — lonely, missing you
  sad:      { hue: 225, saturation: 70, lightness: 52, intensity: 0.5 },
  // Vibrant magenta-pink — thrilled, energetic
  excited:  { hue: 320, saturation: 95, lightness: 75, intensity: 1.3 },
  // Bright white-yellow flash — shocked, alert
  startled: { hue: 55,  saturation: 100, lightness: 88, intensity: 1.5 },
  // Warm peachy glow — cozy, satisfied
  content:  { hue: 32,  saturation: 75, lightness: 72, intensity: 0.8 },
};

// ============================================================================
// BEHAVIOR TYPES
// ============================================================================

type CompanionB = {
  id: "companion";
  since: number;
  orbitR: number;
  orbitAngle: number;
  orbitSpeed: number;
};

type DrifterB = {
  id: "drifter";
  since: number;
  target: { x: number; y: number };
  changeAt: number;
};

type ExplorerB = {
  id: "explorer";
  since: number;
  element: HTMLElement;
  phase: "approach" | "hold" | "leave";
  phaseStart: number;
};

type GrandTourB = {
  id: "grand_tour";
  since: number;
  idx: number;
  targets: HTMLElement[];
  phase: "approach" | "hold" | "fade" | "wait" | "homing";
  phaseStart: number;
  current: HTMLElement | null;
};

type EscortB = {
  id: "escort";
  since: number;
};

type StartledB = {
  id: "startled";
  since: number;
  until: number;
  impulseApplied: boolean;
  dir: { x: number; y: number };
};

type Behavior = CompanionB | DrifterB | ExplorerB | GrandTourB | EscortB | StartledB;

// ============================================================================
// CONSTANTS
// ============================================================================

const CURSOR_FRESH_MS = 450;
const SCROLL_FRESH_MS = 300;
const ESCORT_HOLD_MS = 400;
const STARTLE_DURATION_MS = 800;

const BEHAVIOR_MIN_MS = 5500;
const BEHAVIOR_RNG_MS = 5000;

const IDLE_FOR_TOUR_MS = 4500;  // Quicker to start exploring when idle
const TOUR_COOLDOWN_MS = 4000;

// User needs to move mouse continuously for this long to interrupt guidance
const INTERRUPT_THRESHOLD_MS = 600;

// Initial introduction delay - show guidance feature early
const INTRO_DELAY_MS = 2200;
const TOUR_HOLD_MS = 1400;   // Shorter hold at each item
const TOUR_FADE_MS = 2000;   // Longer fade with intensified breathing
const TOUR_WAIT_MS = 350;    // Shorter wait before next

const EXPLORER_HOLD_MS = 1600;
const EXPLORER_LEAVE_MS = 1200;

const MIN_Y = 90;
const MAX_TOUR_TARGETS = 10;

// Padding zone at top/bottom - items must be outside this zone to be "visible"
const VIEWPORT_PADDING_TOP = 120;
const VIEWPORT_PADDING_BOTTOM = 100;

// Physics - tuned for SLOW, FLUID motion
const SPRING_STIFFNESS = 0.0018; // Very soft spring
const SPRING_DAMPING = 0.025;   // Gentle damping
const VELOCITY_DECAY = 0.965;   // Smooth slowdown
const MAX_SPEED = 7;            // Cap movement speed

// Perlin noise scale for organic drift
const NOISE_SCALE = 0.0008;
const NOISE_AMPLITUDE = 6;

// ============================================================================
// HELPERS
// ============================================================================

function anchorFromCursor(cursor: { x: number; y: number; seen: boolean }) {
  if (cursor.seen) return { x: cursor.x, y: cursor.y };
  return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
}

function randomPointNear(anchor: { x: number; y: number }, radius = 180): { x: number; y: number } {
  const angle = Math.random() * Math.PI * 2;
  const r = radius * (0.4 + Math.random() * 0.6);
  return {
    x: Math.max(80, Math.min(window.innerWidth - 80, anchor.x + Math.cos(angle) * r)),
    y: Math.max(MIN_Y, Math.min(window.innerHeight - 80, anchor.y + Math.sin(angle) * r)),
  };
}

function visibleItems(): HTMLElement[] {
  const all = Array.from(document.querySelectorAll<HTMLElement>("[data-spirit]"));
  const vh = window.innerHeight;
  // Items must be well within viewport (outside padding zones)
  const safeTop = VIEWPORT_PADDING_TOP;
  const safeBottom = vh - VIEWPORT_PADDING_BOTTOM;
  
  return all
    .filter((el) => {
      const r = el.getBoundingClientRect();
      // Item center must be within safe zone, or at least 50% visible in safe zone
      const itemCenter = r.top + r.height / 2;
      const inSafeZone = itemCenter > safeTop && itemCenter < safeBottom;
      const hasEnoughVisible = r.bottom > safeTop + 30 && r.top < safeBottom - 30;
      return inSafeZone && hasEnoughVisible && r.width > 20;
    })
    .sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      if (Math.abs(ra.top - rb.top) > 40) return ra.top - rb.top;
      return ra.left - rb.left;
    });
}

function pointAtItem(el: HTMLElement): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  
  // Calculate ideal position but clamp to visible viewport
  const idealX = r.left + r.width * 0.85;
  const idealY = r.top + r.height * 0.18;
  
  return {
    x: Math.max(60, Math.min(vw - 60, idealX)),
    y: Math.max(MIN_Y, Math.min(vh - 60, idealY)),
  };
}

function lerpValue(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ============================================================================
// BEHAVIOR FACTORIES
// ============================================================================

function makeCompanion(now: number): CompanionB {
  return {
    id: "companion",
    since: now,
    orbitR: 70 + Math.random() * 50,
    orbitAngle: Math.random() * Math.PI * 2,
    orbitSpeed: (0.0003 + Math.random() * 0.0002) * (Math.random() > 0.5 ? 1 : -1),
  };
}

function makeDrifter(now: number, cursor: { x: number; y: number; seen: boolean }): DrifterB {
  return {
    id: "drifter",
    since: now,
    target: randomPointNear(anchorFromCursor(cursor), 200),
    changeAt: now + 3500 + Math.random() * 3000,
  };
}

function makeExplorer(now: number, items: HTMLElement[]): ExplorerB | null {
  if (items.length === 0) return null;
  return {
    id: "explorer",
    since: now,
    element: items[Math.floor(Math.random() * items.length)],
    phase: "approach",
    phaseStart: now,
  };
}

function makeGrandTour(now: number): GrandTourB | null {
  const items = visibleItems().slice(0, MAX_TOUR_TARGETS);
  if (items.length < 2) return null;
  return {
    id: "grand_tour",
    since: now,
    idx: 0,
    targets: items,
    phase: "approach",
    phaseStart: now,
    current: null,
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SpiritGuide() {
  const reduceMotion = useReducedMotion();
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const el = orbRef.current;
    if (!el) return;

    // Initialize Perlin noise
    const perlin = new PerlinNoise();
    let noiseTime = Math.random() * 1000;

    // Position & velocity
    const pos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const vel = { x: 0, y: 0 };
    const target = { x: pos.x, y: pos.y };

    // Visual state
    let scale = 1;
    let scaleTarget = 1;
    let opacity = 0.7;
    let opacityTarget = 0.85;

    // Emotion state with smooth transitions
    let currentEmotion: Emotion = "calm";
    let emotionStartTime = performance.now();
    const emotionState = { ...EMOTIONS.calm };
    const emotionTarget = { ...EMOTIONS.calm };

    // Cursor tracking
    const cursor = { x: pos.x, y: pos.y, seen: false };
    let lastCursorT = 0;
    let lastCursorDist = 0;
    let cursorApproaching = false;
    
    // Sustained movement tracking - for interrupting guidance
    let movementStartT = 0;        // When continuous movement began
    let lastMoveT = 0;             // Last mouse move timestamp
    let isMovingSustained = false; // True if moving for INTERRUPT_THRESHOLD_MS

    // Scroll tracking
    let lastScrollT = 0;
    let lastScrollY = window.scrollY;

    // Idle & tour timing
    let idleStart = performance.now();
    let lastTourEnd = 0;
    
    // Introduction - first-time guidance hint
    let introCompleted = false;
    let introScheduled = false;
    
    // Hover attraction - orb is drawn to hovered spirit items
    let hoveredItem: HTMLElement | null = null;

    // Behavior state
    let behavior: Behavior = makeDrifter(performance.now(), cursor);
    let behaviorEndsAt = performance.now() + BEHAVIOR_MIN_MS + Math.random() * BEHAVIOR_RNG_MS;

    // Breathing - multiple layered oscillations
    const breath = {
      primary: { phase: Math.random() * Math.PI * 2, speed: 0.0008 },
      secondary: { phase: Math.random() * Math.PI * 2, speed: 0.0014 },
      micro: { phase: Math.random() * Math.PI * 2, speed: 0.003 },
    };

    // ========================================================================
    // EMOTION MANAGEMENT
    // ========================================================================

    function setEmotion(emotion: Emotion) {
      if (emotion === currentEmotion) return;
      currentEmotion = emotion;
      emotionStartTime = performance.now();
      Object.assign(emotionTarget, EMOTIONS[emotion]);
    }

    function updateEmotionVisuals(now: number, dt: number) {
      // Smooth transition to target emotion (300-600ms depending on type)
      const transitionSpeed = currentEmotion === "startled" ? 0.15 : 0.04;
      const t = Math.min(1, transitionSpeed * dt);
      
      emotionState.hue = lerpValue(emotionState.hue, emotionTarget.hue, t);
      emotionState.saturation = lerpValue(emotionState.saturation, emotionTarget.saturation, t);
      emotionState.lightness = lerpValue(emotionState.lightness, emotionTarget.lightness, t);
      emotionState.intensity = lerpValue(emotionState.intensity, emotionTarget.intensity, t);
    }

    // ========================================================================
    // BEHAVIOR TRANSITIONS
    // ========================================================================

    function clearTouched() {
      document.querySelectorAll("[data-spirit-touched]").forEach((n) => 
        n.removeAttribute("data-spirit-touched")
      );
    }

    function transition(next: Behavior | null, now: number) {
      // Cleanup previous behavior
      if (behavior.id === "grand_tour") {
        if (behavior.current) behavior.current.removeAttribute("data-spirit-touched");
        lastTourEnd = now;
      }
      if (behavior.id === "explorer" && behavior.phase !== "approach") {
        behavior.element.removeAttribute("data-spirit-touched");
      }

      if (!next) return;

      // Add perpendicular impulse for curved approaches
      if (next.id === "explorer" || next.id === "grand_tour") {
        const targetEl = next.id === "explorer" ? next.element : next.targets[0];
        if (targetEl) {
          const p = pointAtItem(targetEl);
          const dx = p.x - pos.x;
          const dy = p.y - pos.y;
          const len = Math.hypot(dx, dy);
          if (len > 20) {
            const side = Math.random() > 0.5 ? 1 : -1;
            vel.x += (-dy / len) * side * 0.8;
            vel.y += (dx / len) * side * 0.8;
          }
        }
      }

      behavior = next;
      // Grand tour manages its own completion via phases - don't set a timeout
      // Explorer also manages its own completion
      if (next.id === "grand_tour" || next.id === "explorer") {
        behaviorEndsAt = Infinity; // Never auto-expire, let phases control it
      } else {
        behaviorEndsAt = now + BEHAVIOR_MIN_MS + Math.random() * BEHAVIOR_RNG_MS;
      }
    }

    function pickNextBehavior(now: number): Behavior {
      const items = visibleItems();
      
      // Tour if idle long enough
      if (now - idleStart > IDLE_FOR_TOUR_MS && items.length >= 2 && now - lastTourEnd > TOUR_COOLDOWN_MS) {
        const tour = makeGrandTour(now);
        if (tour) return tour;
      }

      const roll = Math.random();
      if (roll < 0.3 && items.length > 0) {
        const explorer = makeExplorer(now, items);
        if (explorer) return explorer;
      }
      if (roll < 0.6) return makeDrifter(now, cursor);
      return makeCompanion(now);
    }

    // ========================================================================
    // BEHAVIOR APPLICATION
    // ========================================================================

    function applyBehavior(b: Behavior, now: number) {
      switch (b.id) {
        case "companion": {
          b.orbitAngle += b.orbitSpeed * 16.67; // Normalize to 60fps
          const anchor = anchorFromCursor(cursor);
          target.x = anchor.x + Math.cos(b.orbitAngle) * b.orbitR;
          target.y = Math.max(MIN_Y, anchor.y + Math.sin(b.orbitAngle) * b.orbitR);
          opacityTarget = 0.88;
          scaleTarget = 1.0;
          setEmotion("calm");
          break;
        }

        case "drifter": {
          if (now > b.changeAt) {
            b.target = randomPointNear(anchorFromCursor(cursor), 220);
            b.changeAt = now + 3200 + Math.random() * 2800;
          }
          target.x = b.target.x;
          target.y = b.target.y;
          opacityTarget = 0.82;
          scaleTarget = 0.95;
          setEmotion("calm");
          break;
        }

        case "explorer": {
          const rect = b.element.getBoundingClientRect();
          const vh = window.innerHeight;
          const elCenter = rect.top + rect.height / 2;
          // Item center must be within safe zone
          if (elCenter < VIEWPORT_PADDING_TOP || elCenter > vh - VIEWPORT_PADDING_BOTTOM) {
            // Clean up and end exploration
            if (b.phase !== "approach") {
              b.element.removeAttribute("data-spirit-touched");
            }
            behaviorEndsAt = now;
            return;
          }

          const p = pointAtItem(b.element);

          if (b.phase === "approach") {
            target.x = p.x;
            target.y = p.y;
            opacityTarget = 0.92;
            scaleTarget = 1.1;
            setEmotion("curious");

            const dist = Math.hypot(p.x - pos.x, p.y - pos.y);
            const speed = Math.hypot(vel.x, vel.y);
            if ((dist < 35 && speed < 2) || now - b.phaseStart > 3500) {
              b.element.setAttribute("data-spirit-touched", "true");
              b.phase = "hold";
              b.phaseStart = now;
            }
          } else if (b.phase === "hold") {
            target.x = p.x;
            target.y = p.y;
            opacityTarget = 1.0;
            scaleTarget = 1.25;
            setEmotion("excited");

            if (now - b.phaseStart > EXPLORER_HOLD_MS) {
              b.element.removeAttribute("data-spirit-touched");
              b.phase = "leave";
              b.phaseStart = now;
            }
          } else {
            target.x = p.x + 60;
            target.y = p.y + 45;
            opacityTarget = 0.65;
            scaleTarget = 0.9;
            setEmotion("content");

            if (now - b.phaseStart > EXPLORER_LEAVE_MS) {
              behaviorEndsAt = now;
            }
          }
          break;
        }

        case "grand_tour": {
          const active = b.targets[b.idx];
          if (!active) {
            behaviorEndsAt = now;
            return;
          }

          // Check if current target is still visible - skip if scrolled out of view
          const activeRect = active.getBoundingClientRect();
          const vh = window.innerHeight;
          const activeCenter = activeRect.top + activeRect.height / 2;
          const isActiveVisible = activeCenter > VIEWPORT_PADDING_TOP && activeCenter < vh - VIEWPORT_PADDING_BOTTOM;
          
          if (!isActiveVisible) {
            // Skip this item - move to next or end tour
            if (b.current) b.current.removeAttribute("data-spirit-touched");
            b.current = null;
            b.idx += 1;
            if (b.idx >= b.targets.length) {
              b.phase = "homing";
              b.phaseStart = now;
            } else {
              b.phase = "approach";
              b.phaseStart = now;
            }
            return; // Re-evaluate on next frame
          }

          const p = pointAtItem(active);
          target.x = p.x;
          target.y = p.y;
          const phaseDt = now - b.phaseStart;

          switch (b.phase) {
            case "approach": {
              // Gradually build up as we approach
              const approachProgress = Math.min(1, phaseDt / 1500); // ramp up over 1.5s
              opacityTarget = 0.85 + approachProgress * 0.15;  // 0.85 → 1.0
              scaleTarget = 1.0 + approachProgress * 0.25;     // 1.0 → 1.25
              setEmotion("curious");

              const dist = Math.hypot(p.x - pos.x, p.y - pos.y);
              const speed = Math.hypot(vel.x, vel.y);
              if ((dist < 32 && speed < 2) || phaseDt > 4000) {
                active.setAttribute("data-spirit-touched", "true");
                b.current = active;
                b.phase = "hold";
                b.phaseStart = now;
              }
              break;
            }
            case "hold": {
              opacityTarget = 1.0;
              scaleTarget = 1.25;
              setEmotion("excited");

              if (phaseDt > TOUR_HOLD_MS) {
                if (b.current) b.current.removeAttribute("data-spirit-touched");
                b.current = null;
                b.phase = "fade";
                b.phaseStart = now;
              }
              break;
            }
            case "fade": {
              // Gradual transition - ease into fade over the duration
              const fadeProgress = Math.min(1, phaseDt / TOUR_FADE_MS);
              const easedProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress); // smoothstep
              opacityTarget = 1.0 - easedProgress * 0.2;   // 1.0 → 0.8
              scaleTarget = 1.25 - easedProgress * 0.25;   // 1.25 → 1.0
              setEmotion("calm");

              if (phaseDt > TOUR_FADE_MS) {
                b.phase = "wait";
                b.phaseStart = now;
              }
              break;
            }
            case "wait": {
              opacityTarget = 0.85;
              scaleTarget = 1.0;

              if (phaseDt > TOUR_WAIT_MS) {
                b.idx += 1;
                
                // Skip any items that are no longer visible (outside safe zones)
                while (b.idx < b.targets.length) {
                  const nextItem = b.targets[b.idx];
                  const nextRect = nextItem.getBoundingClientRect();
                  const nextCenter = nextRect.top + nextRect.height / 2;
                  const isNextVisible = nextCenter > VIEWPORT_PADDING_TOP && nextCenter < vh - VIEWPORT_PADDING_BOTTOM;
                  if (isNextVisible) break;
                  b.idx += 1;
                }
                
                if (b.idx >= b.targets.length) {
                  b.phase = "homing";
                  b.phaseStart = now;
                } else {
                  const nextP = pointAtItem(b.targets[b.idx]);
                  const dx = nextP.x - pos.x;
                  const dy = nextP.y - pos.y;
                  const len = Math.hypot(dx, dy);
                  if (len > 20) {
                    const side = Math.random() > 0.5 ? 1 : -1;
                    vel.x += (-dy / len) * side * 0.6;
                    vel.y += (dx / len) * side * 0.6;
                  }
                  b.phase = "approach";
                  b.phaseStart = now;
                }
              }
              break;
            }
            case "homing": {
              const anchor = anchorFromCursor(cursor);
              target.x = anchor.x;
              target.y = anchor.y;
              opacityTarget = 0.75;
              scaleTarget = 1.0;
              setEmotion("content");

              const dist = Math.hypot(anchor.x - pos.x, anchor.y - pos.y);
              if (dist < 70 || phaseDt > 3000) {
                // Celebration bounce! Quick scale pulse to hint completion
                scaleTarget = 1.25;
                opacityTarget = 1.0;
                setEmotion("happy");
                setTimeout(() => {
                  scaleTarget = 1.0;
                  opacityTarget = 0.85;
                  setEmotion("calm");
                }, 400);
                
                behaviorEndsAt = now;
                lastTourEnd = now;
              }
              break;
            }
          }
          break;
        }

        case "escort": {
          // Dance around cursor with slowly changing offset
          const offsetAngle = now * 0.00025;
          const offsetR = 55 + Math.sin(now * 0.0007) * 20;
          target.x = cursor.x + Math.cos(offsetAngle) * offsetR;
          target.y = Math.max(MIN_Y, cursor.y + Math.sin(offsetAngle) * offsetR);
          opacityTarget = 0.92;
          scaleTarget = 1.05;

          // Happy when cursor is moving with us
          if (cursorApproaching) {
            setEmotion("happy");
          } else {
            setEmotion("calm");
          }
          break;
        }

        case "startled": {
          if (!b.impulseApplied) {
            vel.x += b.dir.x * 6;
            vel.y += b.dir.y * 6;
            b.impulseApplied = true;
          }
          target.x = pos.x;
          target.y = pos.y;
          opacityTarget = 1.0;
          scaleTarget = 1.2;
          setEmotion("startled");

          if (now > b.until) behaviorEndsAt = now;
          break;
        }
      }
    }

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================

    let raf = 0;
    let lastFrame = performance.now();

    function tick(now: number) {
      const rawDt = now - lastFrame;
      const dt = Math.min(rawDt, 50); // Cap for tab switching
      const dtNorm = dt / 16.67; // Normalize to 60fps
      lastFrame = now;

      const cursorFresh = now - lastCursorT < CURSOR_FRESH_MS;
      const scrollFresh = now - lastScrollT < SCROLL_FRESH_MS;

      // Track if cursor is approaching
      const currentCursorDist = Math.hypot(cursor.x - pos.x, cursor.y - pos.y);
      cursorApproaching = cursorFresh && currentCursorDist < lastCursorDist - 2;
      lastCursorDist = currentCursorDist;

      // Update sustained movement tracking
      // Movement is "sustained" if mouse has been moving continuously for INTERRUPT_THRESHOLD_MS
      if (cursorFresh) {
        const timeSinceLastMove = now - lastMoveT;
        if (timeSinceLastMove < 150) {
          // Mouse is actively moving (moves within 150ms of each other)
          if (movementStartT === 0) movementStartT = now;
          isMovingSustained = (now - movementStartT) > INTERRUPT_THRESHOLD_MS;
        } else {
          // Gap in movement - reset
          movementStartT = now;
          isMovingSustained = false;
        }
      } else {
        // No recent cursor activity - reset sustained tracking
        movementStartT = 0;
        isMovingSustained = false;
      }

      // Emotion based on cursor proximity
      if (!cursorFresh && behavior.id !== "startled" && behavior.id !== "explorer" && behavior.id !== "grand_tour") {
        const timeSinceCursor = now - lastCursorT;
        if (timeSinceCursor > 3000 && timeSinceCursor < 8000) {
          setEmotion("sad");
        } else if (timeSinceCursor > 8000) {
          setEmotion("calm");
        }
      }

      // ======== Introduction behavior (first-time hint) ========
      // Target the stats bar specifically for the intro
      if (!introCompleted && !introScheduled && now > INTRO_DELAY_MS) {
        if (behavior.id !== "grand_tour" && behavior.id !== "explorer") {
          // Find the stats bar specifically
          const statsEl = document.querySelector<HTMLElement>('[data-spirit="stats"]');
          if (statsEl) {
            const rect = statsEl.getBoundingClientRect();
            // Only if stats bar is visible
            if (rect.bottom > 50 && rect.top < window.innerHeight - 50) {
              const introExplorer: ExplorerB = {
                id: "explorer",
                since: now,
                element: statsEl,
                phase: "approach",
                phaseStart: now,
              };
              transition(introExplorer, now);
              introScheduled = true;
            }
          }
        }
      }
      
      // After intro explorer completes, ensure we transition properly
      if (introScheduled && !introCompleted && behavior.id !== "explorer" && behavior.id !== "grand_tour") {
        introCompleted = true;
      }

      // ======== Hover attraction ========
      // If user hovers a spirit item and orb is idle, gently drift toward it
      if (hoveredItem && (behavior.id === "companion" || behavior.id === "drifter")) {
        const rect = hoveredItem.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const p = pointAtItem(hoveredItem);
          // Gently bias target toward hovered item
          target.x = lerpValue(target.x, p.x, 0.02);
          target.y = lerpValue(target.y, p.y, 0.02);
          setEmotion("curious");
        }
      }

      // ======== Behavior transitions ========
      if (behavior.id === "startled") {
        if (now > behavior.until) {
          transition(cursorFresh ? { id: "escort", since: now } : makeCompanion(now), now);
        }
      } else if (behavior.id === "grand_tour" || behavior.id === "explorer") {
        // GUIDANCE MODE: Check if phases set behaviorEndsAt to now (completed)
        if (behaviorEndsAt !== Infinity && now >= behaviorEndsAt) {
          // Guidance finished naturally via phase completion
          transition(cursorFresh ? { id: "escort", since: now } : makeCompanion(now), now);
        } else if (isMovingSustained) {
          // User is actively trying to take control - interrupt guidance
          transition({ id: "escort", since: now }, now);
          if (cursorApproaching) setEmotion("happy");
        }
      } else if (cursorFresh && behavior.id !== "escort") {
        transition({ id: "escort", since: now }, now);
        if (cursorApproaching) setEmotion("happy");
      } else if (!cursorFresh && behavior.id === "escort") {
        if (now - lastCursorT > ESCORT_HOLD_MS) {
          transition(makeCompanion(now), now);
          idleStart = now;
        }
      } else if (now > behaviorEndsAt && behavior.id !== "escort") {
        transition(pickNextBehavior(now), now);
      }

      // Track idle for grand tour
      if (cursorFresh || scrollFresh) {
        idleStart = now;
      }

      // ======== Apply current behavior ========
      applyBehavior(behavior, now);

      // ======== Perlin noise for organic drift ========
      noiseTime += 0.00025 * dtNorm;
      const noiseX = perlin.noise3D(pos.x * 0.002, pos.y * 0.002, noiseTime) * NOISE_AMPLITUDE;
      const noiseY = perlin.noise3D(pos.x * 0.002 + 100, pos.y * 0.002, noiseTime + 50) * NOISE_AMPLITUDE;

      // ======== Spring physics ========
      const dx = (target.x + noiseX) - pos.x;
      const dy = (target.y + noiseY) - pos.y;
      
      // Acceleration from spring force
      const ax = dx * SPRING_STIFFNESS;
      const ay = dy * SPRING_STIFFNESS;
      
      // Apply acceleration
      vel.x += ax * dtNorm;
      vel.y += ay * dtNorm;
      
      // Damping (velocity decay)
      const decay = Math.pow(VELOCITY_DECAY, dtNorm);
      vel.x *= decay;
      vel.y *= decay;
      
      // Additional damping proportional to velocity (critical damping feel)
      vel.x -= vel.x * SPRING_DAMPING * dtNorm;
      vel.y -= vel.y * SPRING_DAMPING * dtNorm;

      // Soft tangential pull for orbital modes (creates curved paths)
      if (behavior.id === "companion" || behavior.id === "drifter") {
        const tangentK = behavior.id === "companion" ? 0.0008 : 0.0004;
        vel.x += -dy * tangentK * dtNorm;
        vel.y += dx * tangentK * dtNorm;
      }

      // Speed cap
      const speed = Math.hypot(vel.x, vel.y);
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        vel.x *= scale;
        vel.y *= scale;
      }

      // Update position
      pos.x += vel.x * dtNorm;
      pos.y += vel.y * dtNorm;

      // Keep in bounds
      pos.x = Math.max(40, Math.min(window.innerWidth - 40, pos.x));
      pos.y = Math.max(MIN_Y, Math.min(window.innerHeight - 40, pos.y));

      // ======== Breathing animation (layered oscillations) ========
      // Intensify breathing during fade phase (orb "pulses" while transitioning)
      const inFadePhase = behavior.id === "grand_tour" && (behavior as GrandTourB).phase === "fade";
      const breathSpeedMult = inFadePhase ? 2.2 : 1.0;   // Faster pulsing during fade
      const breathIntensity = inFadePhase ? 2.8 : 1.0;   // Stronger amplitude during fade
      
      const primaryBreath = Math.sin(now * breath.primary.speed * breathSpeedMult + breath.primary.phase);
      const secondaryBreath = Math.sin(now * breath.secondary.speed * breathSpeedMult + breath.secondary.phase);
      const microBreath = Math.sin(now * breath.micro.speed * breathSpeedMult + breath.micro.phase);
      
      // Combine breathing layers with different weights
      // Primary: big slow breath, Secondary: subtle variation, Micro: tiny shimmer
      const breathScale = 1 + (primaryBreath * 0.06 + secondaryBreath * 0.025 + microBreath * 0.01) * breathIntensity;
      const breathOpacity = 1 + (primaryBreath * 0.08 + secondaryBreath * 0.04) * breathIntensity;

      // ======== Smooth visual transitions (slower, no jumping) ========
      // Use smaller lerp factor for smoother transitions
      const scaleLerp = 0.018 * dtNorm;
      const opacityLerp = 0.022 * dtNorm;
      scale += (scaleTarget - scale) * scaleLerp;
      opacity += (opacityTarget - opacity) * opacityLerp;

      // Update emotion colors
      updateEmotionVisuals(now, dtNorm);

      // ======== Apply to DOM ========
      const finalScale = scale * breathScale;
      const finalOpacity = Math.max(0.15, Math.min(1, opacity * breathOpacity * emotionState.intensity));

      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) scale(${finalScale.toFixed(4)})`;
      el.style.opacity = finalOpacity.toFixed(3);
      
      // Update emotion colors via CSS custom properties
      el.style.setProperty("--spirit-hue", emotionState.hue.toFixed(1));
      el.style.setProperty("--spirit-sat", `${emotionState.saturation.toFixed(1)}%`);
      el.style.setProperty("--spirit-light", `${emotionState.lightness.toFixed(1)}%`);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    function onScroll() {
      const now = performance.now();
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      lastScrollT = now;

      // Gentle push opposite to scroll direction
      vel.y -= dy * 0.08;
      vel.y = Math.max(-15, Math.min(15, vel.y));

      // Startle on fast scroll
      if (Math.abs(dy) > 40 && behavior.id !== "startled") {
        transition({
          id: "startled",
          since: now,
          until: now + STARTLE_DURATION_MS,
          impulseApplied: false,
          dir: {
            x: (Math.random() - 0.5) * 0.5,
            y: dy > 0 ? -0.7 : 0.7,
          },
        }, now);
      }
    }

    function onMouseMove(e: MouseEvent) {
      const now = performance.now();
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.seen = true;
      lastMoveT = now;
      lastCursorT = now;
    }
    
    // Hover detection for spirit items - orb is attracted to hovered items
    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const spiritItem = target.closest("[data-spirit]") as HTMLElement | null;
      if (spiritItem) {
        hoveredItem = spiritItem;
      }
    }
    
    function onMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const spiritItem = target.closest("[data-spirit]") as HTMLElement | null;
      if (spiritItem && hoveredItem === spiritItem) {
        hoveredItem = null;
      }
    }

    function onClick(e: MouseEvent) {
      const now = performance.now();
      const clickTarget = e.target as HTMLElement;
      
      // Check if clicked element is interactive
      const isInteractive = 
        clickTarget.closest("a, button, input, textarea, select, [role='button'], [tabindex], [onclick]") !== null ||
        clickTarget.tagName === "A" ||
        clickTarget.tagName === "BUTTON" ||
        clickTarget.tagName === "INPUT" ||
        clickTarget.tagName === "TEXTAREA" ||
        clickTarget.tagName === "SELECT" ||
        window.getComputedStyle(clickTarget).cursor === "pointer";

      // If already in guidance mode, do nothing - click only STARTS guidance
      if (behavior.id === "grand_tour" || behavior.id === "explorer") {
        return;
      }

      // If clicking non-interactive area, start exploration!
      if (!isInteractive) {
        const items = visibleItems();
        if (items.length >= 2) {
          const tour = makeGrandTour(now);
          if (tour) {
            transition(tour, now);
            setEmotion("curious");
            return;
          }
        }
        // Fall back to single exploration if not enough items for tour
        if (items.length > 0) {
          const explorer = makeExplorer(now, items);
          if (explorer) {
            transition(explorer, now);
            setEmotion("curious");
          }
        }
      }
    }

    function onVisibilityChange() {
      if (document.hidden) {
        clearTouched();
      } else {
        lastFrame = performance.now();
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      cancelAnimationFrame(raf);
      clearTouched();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      ref={orbRef}
      aria-hidden
      className="spirit-orb pointer-events-none fixed left-0 top-0 z-[45] will-change-transform"
    >
      <div className="spirit-orb-halo" />
      <div className="spirit-orb-core" />
    </div>
  );
}
