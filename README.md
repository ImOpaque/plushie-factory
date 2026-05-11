# Plushie Factory (PF)

Vite + React + TypeScript clicker with a Three.js factory stage (React Three Fiber, Rapier).

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` (e.g. `copy .env.example .env` on Windows, or `cp .env.example .env` on macOS/Linux). Edit `.env` if your model URL differs.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build

## Moving to another PC

The Git repo holds **source code and assets** tracked by Git. It does **not** include Cursor chat history or Composer sessions; those live in Cursor’s local/cloud data for your account, not inside this folder.

To keep **project context** for yourself or for the AI on a new machine:

- Put durable notes in **this repo** (README, code comments, or `.cursor/rules` if you use them).
- On the new PC: clone the repo, `npm install`, copy `.env` from `.env.example`, open the folder in Cursor (same account if you want synced chats where Cursor supports it).

`node_modules` and `dist` are not committed; regenerate them with `npm install` and `npm run build` as needed.
