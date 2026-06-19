<h1 align="center">creative-director</h1>
<div align="center">
<img width="800" height="450" alt="creative-director demo" src="./assets/demo.gif" />
<br /><br />
<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/3a01b680-51df-46e5-a057-4a0297ca1d47" />
</div>


A Claude Skill that turns a visual brief — a reference image, a mood, a brand —
into a **creative brief for AI** tailored to that exact brief. It does not
generate the final landing page, portfolio, or interactive artifact itself.
It generates the *instructions* a builder (a follow-up Claude pass, or any other model)
uses to generate that artifact.

Think of it as hiring a creative director before you hire a developer.

> **Important:** `creative-director` produces a **creative brief**, not a design system.
> A design system gives you walls. This gives you a canvas — stretched and primed
> for one specific painting.

---

## How It Works

```

  [1] Reference Image / Mood
           │
           ▼
  ┌─────────────────────┐
  │   creative-director │  ← Claude (Sonnet 4.6+), web chat
  │   (this skill)      │
  └─────────────────────┘
           │
           ▼
  [2] Creative Brief (generated Skill)
           │
           ├──────────────────────────┐
           ▼                          ▼
  [3] UI Narrative              [Design direction]
  (what content goes             (colors, type,
   on the page)                  motion, layout)
           │                          │
           └──────────┬───────────────┘
                      ▼
             ┌─────────────────┐
             │  HTML Builder   │  ← any model (e.g. GPT-5.5)
             │  (separate pass)│
             └─────────────────┘
                      │
                      ▼
             [4] Final Artifact
                      │
                      ▼
             [5] Temper / Refine
                  or request
                 design system
```

---

## Step-by-Step Usage

### Step 1 — Find a reference image

Pick any visual reference that captures the mood or style you want:
a screenshot of a site you admire, a moodboard, a brand asset, a film still,
a photograph. The more specific the image, the more directed the output.

---

### Step 2 — Ask Claude to analyze it

Open **Claude web chat** (claude.ai) — use **Sonnet 4.6 or better**.
Do not use Claude Code for this step; you need vision input in the chat interface.

Attach your reference image and the `SKILL.md` file (if you haven't saved it
to Claude's memory), then send a prompt like:

```
Based on the creative-director Skill, study the design of the image I'm
sending. Pay attention at the pixel level — color usage and color selection
logic, typography, font pairing, and layout structure. Generate the Skill for me.
```

Claude will produce a **creative brief** — a generated Skill document specific
to your reference image.

---

### Step 3 — Understand what you received

The output is a **creative brief for AI**, not a design system.

- A design system = fixed rules applied the same way every time
- A creative brief = specific direction for *this one* project

The brief contains: color architecture, typographic decisions, animation
budget, layout logic, signature element, and anti-patterns to avoid.
It is written so a builder model can implement it without guessing.

---

### Step 4 — Write a UI narrative

Before handing anything to a builder model, write a short narrative
describing **what content should be on the page** — not how it should look.
Think of it like briefing a UX designer on the content, not the design.

Example:
```
This is a landing page for a freelance motion designer.
It should have: a hero with name and tagline, a reel section with 3 featured
projects, a brief about section, and a contact form at the bottom.
Client logos don't need to appear. The tone is minimal and serious.
```

You can use any AI to help write this narrative.

---

### Step 5 — Build the artifact

Now you have two inputs:
- The **creative brief** (from Step 2)
- The **UI narrative** (from Step 4)

Send both to your HTML builder model (the examples here use GPT-5.5):

```
Build a landing page using the content from this narrative.
For all design decisions — colors, typography, layout, motion, spacing —
follow the creative brief (Skill) below exactly.

[paste narrative]

[paste creative brief / generated Skill]
```

---

### Step 6 — Temper or finalize

Once you have the output:

- **Temper it yourself** — adjust copy, swap images, tweak spacing manually
- **Iterate with the builder** — ask for specific changes
- **Request a design system** — once you're happy with the direction,
  ask Claude to formalize it into a reusable design system for future builds

---

## Why a two-pass design?

Generic prompts produce generic output. If you ask a model to "build a cool
animated landing page," it reaches for the same rounded corners, the same
fade-in-on-scroll, the same hero gradient — regardless of your brief.

`creative-director` forces the creative decisions to happen **before** any
code is written. It reads the brief, makes explicit decisions grounded in
that brief, and writes those decisions into a new Skill. A separate build
pass then follows that Skill to produce the actual artifact.

---

## What it does, step by step (internal passes)

1. **Pass 1 — Read the brief.** Extracts six things from the input: dominant
   visual core, typographic character, motion character, a single mood word,
   what the design must *avoid* feeling like, and the primary interaction loop.

2. **Pass 2 — Make the craft decisions.** Eight concrete decisions (A–H):
   output medium, color architecture, typographic system, the one signature
   element, animation budget, layout logic, what any generative element does,
   and mobile strategy. Each decision must trace back to the mood word or
   visual core from Pass 1.

3. **Pass 2.5 — Interaction architecture** *(only if the brief has interactive elements).*
   For every control or hover state, writes a behavioral contract:
   **State** (what variables exist), **Trigger** (what user action changes them),
   **Reaction** (what visibly updates, named element by element).

4. **Pass 3 — Write the generated Skill.** Assembles everything into a
   complete, self-contained Skill document: design system (hex values, type,
   spacing), section-by-section brief, signature element spec, functional
   spec per interactive element with pseudocode, animation/interaction rules,
   and brief-specific anti-patterns.

---

## What it deliberately does *not* do

- Does not produce final HTML, React, or any other artifact — that's a separate build step
- Does not enforce universal aesthetic rules as fixed constraints — every rule is derived from the specific brief
- Does not ask clarifying questions before reading the brief — it reads the image the way a creative director opens a brand deck
- Does not default to the same look regardless of input

---

## Installation

This is a Claude Skill — a Markdown file that Claude reads to learn a new procedure.

1. Copy `SKILL.md` from this repo into your skills directory
   (e.g. `/mnt/skills/public/creative-director/SKILL.md`)
2. No dependencies, no build step — it's a plain instruction file

Alternatively, attach `SKILL.md` directly in your Claude chat session
when running the skill.

---

## More Examples

All examples below: brief generated with **Claude Sonnet 4.6**, HTML built by **GPT-5.5**.
<div align="center">
<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/db1f5148-f38d-4119-af50-0e13a9f878f7" />
<br /><br />
<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/875c9b40-f212-4e48-85f1-d2b74250d9f5" />
<br /><br />
<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/32fde6c5-4584-4343-8eba-cdb78cef61db" />
<br /><br />
<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/ad9088f0-dfb9-4b12-a3cb-52e9920bd4e3" />
</div>



---

## License

Licensed under CC BY-NC 4.0.

You may use, copy, modify, and share this project for non-commercial purposes only. Commercial use, resale, paid redistribution, or inclusion in paid products/services is not allowed without permission.

© 2026 Muhammad Fikri.
