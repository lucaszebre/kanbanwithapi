# Kanban

A Kanban task manager front end: boards, columns, tasks and subtasks with drag-and-drop, built with React 19, Vite and TanStack Query. It talks to the companion Express + Prisma API, [KanbanExpressAPi](https://github.com/lucaszebre/KanbanExpressAPi).

Live demo: https://kanbanwithapi-pi.vercel.app/

## What it does

- Email/password sign-up and login, cookie-based session with silent refresh-token renewal
- Create, rename and delete boards; each board has its own columns
- Add, edit, move and delete tasks; tick off subtasks
- Drag-and-drop tasks between columns and reorder columns (dnd-kit)
- Optimistic UI: local Zustand store updated immediately, synced to the API with TanStack Query mutations
- English / French interface (i18next, browser language detection)
- Light and dark theme (next-themes)
- Responsive layout with a collapsible sidebar

## Stack

- React 19, TypeScript 5.8, Vite 7 (SWC plugin)
- React Router 7 (lazy-loaded routes)
- TanStack Query 5 for server state, Zustand 5 for local board state
- dnd-kit (`@dnd-kit/react`, `@dnd-kit/sortable`) for drag-and-drop
- Tailwind CSS 4, Radix UI primitives / shadcn-style components, lucide-react icons
- react-hook-form + zod for forms and validation
- axios (`withCredentials`) for API calls
- i18next + react-i18next for translations
- ESLint 9 with typescript-eslint, react-hooks and react-refresh plugins

## Run locally

Prerequisites: Node 20+ and npm. You also need the API running; see [KanbanExpressAPi](https://github.com/lucaszebre/KanbanExpressAPi) for its own setup.

```bash
git clone https://github.com/lucaszebre/kanbanwithapi.git
cd kanbanwithapi
npm ci
cp .env.example .env   # then edit the values
npm run dev            # http://localhost:3000
```

Environment variables (see `.env.example`):

| Variable            | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `VITE_BASE_URL_API` | Base URL of the KanbanExpressAPi instance the front end calls           |
| `VITE_PORT`         | Optional dev/preview server port (defaults to 3000 in `vite.config.ts`) |

The app sends cookies cross-origin (`withCredentials: true`), so the API must allow the front end's origin in its CORS configuration.

Other scripts:

```bash
npm run build     # tsc -b && vite build -> dist/
npm run preview   # serve the production build
npm run lint      # eslint .
```

## Status

Started in 2023 as a learning project, last active in 2025. Dependencies refreshed in October 2026; not under active feature development.
