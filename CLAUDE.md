# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Full-stack MERN note-taking app with two independent npm packages (no root `package.json`, no workspaces):

- `backend/` — Express 5 + Mongoose REST API (ES modules)
- `frontend/` — React 19 + Vite 7 + Tailwind CSS 3 + React Router 7

There are no tests in either package.

## Commands

Run each from its own directory (`npm install` separately in both).

Backend (`backend/`):
- `npm start` — runs `nodemon index.js` (auto-reload)
- Requires a `backend/.env` (gitignored) with `MONGO_URL` and optionally `PORT`

Frontend (`frontend/`):
- `npm run dev` — Vite dev server
- `npm run build` / `npm run preview`
- `npm run lint` — ESLint (flat config in `eslint.config.js`)

## Architecture

**Backend:** `index.js` connects Mongoose, applies `express.json()` and open `cors()`, and mounts all routes under `/api/v1/noteapp`. Layering is `routes/note.route.js` → `controllers/note.controller.js` → `models/note.model.js`. The single `Note` model has `title` and `content` (both required) plus Mongoose `timestamps`.

Endpoints (relative to `/api/v1/noteapp`):
- `POST /create-note`
- `GET /get-notes` (sorted by `createdAt` desc)
- `PUT /update-note/:id`
- `DELETE /delete-note/:id`

**Frontend:** All server state lives in `src/context/NoteContext.jsx` (`NoteProvider`, wrapped around `App` in `main.jsx` inside `BrowserRouter`). It fetches notes on mount and exposes `notes`, `loading`, `createNote`, `updateNote`, `deleteNote`; components consume it via `useContext(NoteContext)` rather than calling the API directly. The axios instance is in `src/api/url.js` with a hardcoded base URL. Routes: `/` (`Home` — grid of `Notecard`s with inline edit/delete) and `/create` (`Createnote` → `Noteform`).

## Known pitfalls

- **Port mismatch:** backend defaults to port `4002` (`backend/index.js`), but the frontend axios base URL points to `http://localhost:4001`. Set `PORT=4001` in `backend/.env` or update one side.
- `createNote` in `NoteContext.jsx` calls `setNotes(response.data, ...note)`, which replaces the notes array with a single object instead of prepending the new note.
- `deleteNote` controller responds with status `400` on success.
- `mongoose.connect` isn't awaited, so "Connected to DB" logs regardless of whether the connection succeeds.
