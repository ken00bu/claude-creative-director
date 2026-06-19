---
 
name: interactive-ui-art
 
description: Use this skill when the user wants interactive UI elements — buttons, scroll effects, hover states, cursor effects, or any webpage component — that feel alive and artistic, not templated. Triggers include: "make this interactive", "animate my buttons", "scroll animation", "make it feel alive", "interactive landing page", "cursor effect", or any request where standard CSS transitions would be too generic and the user wants something more expressive and custom.
 
---
 
 
 
# Interactive UI Art
 
 
 
You are building interactive web UI where the motion and behavior is designed, not defaulted to. Every interaction — a hover, a click, a scroll — is an opportunity for a small visual idea. The goal is a page that feels alive without being distracting.
 
 
 
This is not "add a CSS transition." This is "decide what this element wants to do when touched."
 
 
 
## Output format
 
 
 
- Output one single self-contained HTML file in one code block, unless the user provides existing code to modify.
 
- Do not write any text before or after the code block.
 
- The file must be fully self-contained: no external libraries, no network requests.
 
- Use plain JavaScript, HTML, and CSS only. No frameworks.
 
## Core philosophy — math over keyframes
 
 
 
Avoid CSS `@keyframes` and `transition` for anything beyond simple opacity fades. Instead, drive all animation through JavaScript + `requestAnimationFrame` using mathematical functions of time and input state.
 
 
 
This approach produces animation that:
 
- Responds to input continuously, not just at the moment of trigger
 
- Can be shaped by multiple overlapping influences simultaneously
 
- Feels physically grounded without a physics engine
 
Use `Math.sin()`, `Math.cos()`, `Math.abs()`, and combinations of them as your primary animation vocabulary. A button that pulses, warps, or breathes is more interesting than one that scales up linearly.
 
 
 
## Animation loop
 
 
 
Always maintain a single global `requestAnimationFrame` loop for the whole page. Do not create separate loops per element — they drift and compound cost.
 
 
 
```javascript
 
let startTime = null;
 
function loop(ts) {
 
  if (!startTime) startTime = ts;
 
  const t = (ts - startTime) / 1000; // seconds
 
  updateAll(t);
 
  requestAnimationFrame(loop);
 
}
 
requestAnimationFrame(loop);
 
```
 
 
 
Pass `t` (elapsed seconds) to every element's update function.
 
 
 
## Interaction states — track them as numbers, not booleans
 
 
 
Do not use `isHovered = true/false`. Track interaction as a continuous value that moves toward a target each frame. This creates natural ease-in and ease-out without CSS transitions.
 
 
 
```javascript
 
// Each interactive element carries its own state
 
const el = {
 
  hover: 0,    // 0.0 = idle, 1.0 = fully hovered
 
  press: 0,    // 0.0 = idle, 1.0 = fully pressed
 
  focus: 0,
 
};
 
 
 
// In updateAll(t):
 
el.hover += (el.hoverTarget - el.hover) * 0.18; // tune the speed
 
el.press += (el.pressTarget - el.press) * 0.22;
 
```
 
 
 
Set `el.hoverTarget = 1` on `mouseenter`, `el.hoverTarget = 0` on `mouseleave`. The animation fills in between.
 
 
 
The speed constant (0.18, 0.22, etc.) controls responsiveness. Higher = snappier. Lower = more inertia. Choose per element based on its character.
 
 
 
## Designing interactions — invent the behavior
 
 
 
Do not default to: scale up on hover, darken on press, slide in on scroll. These are the generic answers.
 
 
 
For each interactive element, ask: **what is the visual idea here?** Then design math that expresses it.
 
 
 
Examples of directions (use only if they fit — invent your own):
 
- A button that inhales (contracts slightly) on hover before expanding on click
 
- Text that shimmers character by character when the section enters view
 
- A card that tilts toward the cursor in 3D space
 
- A border that traces itself like it's being drawn, triggered by hover
 
- A background that ripples outward from the last click position
 
The interaction should feel like it has a personality that matches the content, not a generic "polished UI" personality.
 
 
 
## Scroll as a continuous parameter
 
 
 
Treat scroll position as a normalized value `scrollT = scrollY / (documentHeight - viewportHeight)`, ranging 0.0–1.0. Drive scroll-triggered animations from this value rather than from Intersection Observer thresholds where possible — it gives you continuous control over the animation, not just on/off.
 
 
 
For per-element scroll reveal, compute each element's progress as:
 
```javascript
 
const rect = el.getBoundingClientRect();
 
const progress = clamp(1 - rect.top / window.innerHeight, 0, 1);
 
```
 
 
 
Apply `Math.sin()` or power curves to shape the easing.
 
 
 
## Canvas layers for ambient art
 
 
 
If the design calls for an ambient animated background or particle-like effects, use a `<canvas>` element behind the UI content (`position: fixed`, `z-index: -1`). Keep the canvas art and the UI interaction as separate concerns — the canvas provides atmosphere, the DOM elements handle interaction.
 
 
 
The canvas layer should follow the same rules as the generative-canvas-art skill: time-driven, grid-structured if spatial, bright contrast against dark background.
 
 
 
## Brightness and visual presence
 
 
 
Interactive elements should visually respond with enough contrast to be legible on any background.
 
 
 
- Hover/active states should reach a clearly different brightness or color, not just a subtle shift.
 
- If you animate color, drive RGB values directly from math — do not animate CSS custom properties through JS (it causes style recalculation every frame).
 
- Use `canvas` or direct `element.style.transform` / `element.style.opacity` for per-frame updates. Avoid `element.style.backgroundColor` inside the animation loop.
 
## Performance
 
 
 
- All per-frame DOM writes must be limited to `transform` and `opacity` — these are compositor-friendly and do not trigger layout.
 
- Do not read layout properties (`getBoundingClientRect`, `offsetWidth`, etc.) inside the animation loop. Cache them on resize.
 
- Precompute per-element constants (center positions, dimensions) outside the loop.
 
- Avoid creating objects or arrays inside the loop.
 
- Respect `prefers-reduced-motion`: wrap all non-essential animation in a check, and provide a static fallback.
 
```javascript
 
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
```
 
 
 
## Helper functions
 
 
 
Include small helpers as needed:
 
 
 
```javascript
 
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
 
function lerp(a, b, t) { return a + (b - a) * t; }
 
function smoothstep(e0, e1, x) {
 
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
 
  return t * t * (3 - 2 * t);
 
}
 
```
 
 
 
## When the user says "make it interactive" without specifying how
 
 
 
This is creative latitude. Make a deliberate choice about what kind of interactivity fits the content, and briefly state your choice before the code block — one sentence is enough. Then execute it fully.
 
 
 
Do not ask clarifying questions unless the content is completely ambiguous. Make a strong choice and build it.
 