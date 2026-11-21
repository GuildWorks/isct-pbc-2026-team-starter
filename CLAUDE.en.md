# CLAUDE.md

<!-- English version of CLAUDE.md. Claude Code reads only CLAUDE.md, so if your team works in English, replace the contents of CLAUDE.md with this file and delete this file. -->

This file makes everyone's Claude Code on the team follow the same rules. It has two parts:

- "What this app is": rewrite it for your theme and technology. Fill in the "(team writes this)" sections before you start.
- "Development rules": independent of the theme and technology. You can also copy it as is into your team's camp repository (your team decides whether to).

When you change this file, have the team review it in a PR.

---

# What this app is (rewrite for your theme)

## What we are building (team writes this)

<!-- Whose problem, what problem, and how the app solves it. 2-3 lines -->

## What we will not do (team writes this)

<!-- Examples: no login, no publishing to the internet, no payments -->

## Tech stack

- Node.js 24 or later. Runs on the built-in `node:http` and `node:sqlite` only. No dependency packages.
- The server builds the HTML for each screen. Styles are in `public/style.css`.
- Data is stored in a local SQLite file (`data.db`).
- AI calls go to Gemini through `lib/gemini.js`. Without a key it returns mock responses.
- Pass any text shown on screen through `escapeHtml` in `lib/html.js`.

## How files are split

- Features live in `features/`, one file per feature (e.g. `features/items-list.js`). A new feature goes in a new file.
- Each feature file exports `routes` (which URLs it handles). `server.js` loads them automatically, so you do not need to touch `server.js`.
- The file everyone shares is `shared/nav.js` (the navigation at the top). Add one link when you add a feature.
- `lib/` holds tools everyone uses.

## How to check this app (team writes this)

<!-- The command that runs the tests, and what a person checks in the browser after a change -->

- Command to run the tests:
- What a person checks in the browser:

---

# Development rules (independent of theme and technology; can be copied into your camp repository as is)

## Branches and PRs

- Never push directly to main. Build each feature on its own branch, and merge into main only through a PR.
- One PR contains one feature. Keep PRs small.
- Write PRs with `.claude/skills/write-pr` (ask "Write a PR").
- Keep changes to shared files small, and mention them to the team in the PR.
- Discuss with the team before adding a library or dependency package.

## How we check

- A person decides what to check, and checks it by operating the app with their own hands. Do not stop at Claude saying "done".
- After a change, run the tests before opening a PR (the command is under "How to check this app").
- Turn what you want to check every time into a test. Tests are there to notice when someone's change breaks another person's feature.
- Tests never call real APIs (external AI and so on). Use mocks or a replaced network call in tests.

## Hands off

- Do not read or commit `.env` (or `.env.local` and similar). Each person keeps their own key in their own `.env` and does not share it with the team. Never show key values on screen, in logs, or in PRs.
- Do not delete database files or anyone's data. Discuss with the team before changing the shape of the data.
- Escape user input and AI output before showing it on screen (never let it run as HTML).
- Do not send personal information or secrets to external AI (providers may use free-tier input to improve their products).
