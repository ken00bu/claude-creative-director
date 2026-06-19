# creative-director

A Claude Skill that turns a visual brief — a reference image, a mood, a brand —
into a **second, bespoke Skill** tailored to that exact brief. It does not
generate the final landing page, portfolio, or interactive artifact itself.
It generates the *instructions* a builder (a follow-up Claude pass, or you)
uses to generate that artifact.

Think of it as hiring a creative director before you hire a developer.

## Why a two-pass design?

Generic prompts produce generic output. If you ask a model to "build a cool
animated landing page," it reaches for the same rounded corners, the same
fade-in-on-scroll, the same hero gradient it always reaches for — regardless
of brief.

`creative-director` exists to force the decisions that make a page feel
*directed* — both visually and functionally — to happen **before** any code
is written. It reads the brief, makes explicit creative and interaction
decisions grounded in that brief, and writes those decisions down as a new
Skill. That generated Skill is the deliverable. A separate build pass then
follows it to produce the actual HTML/React/CSS artifact.

## This is not a design system

It's worth being precise about what this skill is *not*, because the output
can look superficially similar to one.

A design system hands an executor a fixed rulebook: the same tokens, the
same spacing scale, the same component library, applied the same way every
time regardless of brief. It optimizes for consistency across many
unrelated pages.

`creative-director` does the opposite. You hand it a moodboard — a
reference image, a brand, a mood — and it acts like an actual creative
director would: it reads that one moodboard and produces a direction
*specific to it*, then hands that direction to an executor (a follow-up
build pass) as a brief, not a cage. The generated Skill is a canvas with the
right boundaries drawn on it, not a locked set of rules to satisfy.

That's why, for example, the animation guidance the skill produces is
written as a constraint and a pseudocode sketch of the data flow ("X runs
continuously, Y responds to user input, nothing else moves" — plus the
3–8 line pseudocode required for any non-trivial interactive element), not
as a fixed recipe like "use ease-out, 800ms, translateY" the way a design
system token would. The executor still has to choose the actual easing
curve, the actual motion math (lerp, sine/cosine, noise, whatever fits), and
the actual technique — the generated Skill tells it what feeling the motion
needs to produce and what must update, and leaves the *how* open on purpose.

In short: a design system gives you walls. This skill gives you a canvas,
stretched and primed for one specific painting, and trusts the painter with
the brush.

## What it does, step by step

The skill runs through four passes:

1. **Pass 1 — Read the brief.** Extracts six things from the input (image
   or text): the dominant visual core, the typographic character, the
   motion character, a single mood word, what the design must *avoid*
   feeling like, and the primary interaction loop (or explicitly "no
   interaction").

2. **Pass 2 — Make the craft decisions.** Eight concrete decisions (A–H):
   output medium, color architecture, typographic system, the one signature
   element, the animation budget, layout logic, what any generative element
   does, and the mobile strategy. Each decision must be traceable back to
   the mood word or visual core from Pass 1 — "no, because..." is a valid
   and expected answer.

3. **Pass 2.5 — Interaction architecture** *(only if the brief has any
   interactive element).* For every control, hover state, or scrubber, the
   skill writes a behavioral contract: **State** (what variables exist),
   **Trigger** (what user action changes them), **Reaction** (what visibly
   updates, named element by element). This is deliberately specific enough
   that a builder could implement it without guessing.

4. **Pass 3 — Write the generated Skill.** Assembles everything into a
   complete, self-contained Skill document with six sections: design system
   (hex values, type, spacing), section-by-section brief, the signature
   element spec, a functional spec per interactive element (with
   pseudocode), explicit animation/interaction rules, and brief-specific
   anti-patterns.

## What it deliberately does *not* do

- It does not produce final HTML, React, or any other artifact — that's a
  separate build step.
- It does not enforce universal aesthetic rules (no shadows, no rounded
  corners, etc.) as fixed constraints. Every stylistic rule in the output
  is derived fresh from that specific brief in Pass 2.
- It does not ask clarifying questions before reading the brief — if you
  give it a reference image, it reads the image the way a creative director
  opens a brand deck, rather than interrogating you for a written
  description on top of it.
- It does not default to the same look regardless of input.

## Installation

This is a Claude Skill — a Markdown file with YAML frontmatter that Claude
reads to learn a new procedure.

1. Copy `SKILL.md` from this repo into your skills directory (for example
   `/mnt/skills/public/creative-director/SKILL.md` if you're running it in
   an environment with that convention, or wherever your Claude setup
   loads custom skills from).
2. No dependencies, no build step — it's a plain instruction file.

## How to use it

Give Claude a creative brief and ask it to use the skill. A brief can be:

- A **reference image** (a screenshot of a site you like, a mood board, a
  brand asset) — this is the preferred input; the skill treats an image as
  a complete brief on its own.
- A **text description** of a mood, brand, or page you want.

Example prompts:

```
Use the creative-director skill on this reference image and write me
the generated skill for a landing page in this style.
```

```
Apply creative-director to this brief: a portfolio site for a
synth-leaning electronic musician, dark, a little menacing, with a
waveform visualizer that reacts to an audio file the user uploads.
```

### What you get back

A response in four labeled sections, in this order:

1. **Brief reading** — the six Pass 1 extractions, short prose.
2. **Craft decisions** — A through H, one sentence each.
3. **Interaction architecture** — one State/Trigger/Reaction block per
   interactive element (skipped entirely if the brief has no interaction).
4. **Generated Skill** — the full output, in a fenced ```skill code block.

### What to do with the generated Skill

The fenced `skill` block in section 4 is itself a usable Skill. You can:

- Paste it into a new turn and ask Claude to build the artifact following
  it directly, or
- Save it as its own `SKILL.md` if you want to reuse that exact creative
  direction for multiple builds later.

It is written to be specific to the one brief it came from — functional
specs include pseudocode, exact hex values, and named anti-patterns, so a
builder pass can implement it without re-deriving any creative decisions
or guessing at vague instructions like "the visualization updates."

## A note on reference images

If you hand this skill a screenshot of an existing live site, it can only
read what's visible in that single static image. It will infer plausible
interactive behavior (hover states, animation, real-time data) from visual
cues — a motion-trail cursor, a running clock, a scrubber control — but it
cannot confirm those are the *actual* behaviors of the original site. Good
output from this skill says so explicitly rather than presenting inferred
behavior as observed fact.

## License

Add your preferred license here before publishing (e.g. MIT).# claude-creatove-director
