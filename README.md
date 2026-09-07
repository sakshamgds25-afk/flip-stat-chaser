# Coin Flip Simulator

"Build a responsive, single-page web app called 'Interactive Virtual Coin Flipper' — a probability simulator for coin flips. Requirements:

Core functionality

A visually animated coin (heads/tails) that flips when the user clicks a 'Flip' button.

Support flipping once or in batches (e.g., 10, 100, 1000 flips at once) with an input field for custom flip counts.

Random 50/50 outcome logic (or configurable bias %, if extending later).

Animation

Smooth 3D-style flip animation (CSS transform/rotation) for single flips.

For batch flips, a faster/simplified animation or progress indicator so it doesn't lag.

Tallying & Stats

Running count of Heads and Tails.

Live percentage breakdown (Heads % / Tails %) updated after every flip.

Total flip counter.

A 'Reset' button to clear all stats.

Visualization

A simple bar or pie chart showing the heads/tails ratio, updating live.

Optional: a history log of the last N results (e.g., last 20 flips shown as H/T icons).

Responsive design

Must work cleanly on mobile, tablet, and desktop (flexbox/grid layout, no horizontal scroll, touch-friendly buttons).

Coin and controls should resize/reflow gracefully across breakpoints.

Tech

Plain HTML/CSS/JS (or React if preferred), no backend needed — all logic client-side.

Keep it in a single file/component for portability.

Design should feel clean and modern, with clear visual feedback on each flip result."

Want me to just build this as a working artifact right now instead of you taking the prompt elsewhere?

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://flip-stat-chaser.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/694c9909-09c4-4f11-acfb-99bb8752d39e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
