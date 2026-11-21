# isct-pbc-2026-team-starter

[日本語](README.md)

A team-development starter for Learning Phase #4 of the Institute of Science Tokyo Programming Bootcamp 2026.
It contains a list, detail, and add screen for a generic "item" with no fixed theme, plus one example AI feature. Your team replaces the items with your own theme.

There are no dependency packages. It runs on Node.js 24 or later only.

## Working in English

- `CLAUDE.md` is in Japanese. If your team works in English, replace its contents with `CLAUDE.en.md` (for example, ask Claude: "Replace CLAUDE.md with the contents of CLAUDE.en.md and delete CLAUDE.en.md"). Claude Code reads only `CLAUDE.md` automatically.
- The "write a PR" skill (`.claude/skills/write-pr/`) works in English too. Ask "Write a PR" and it writes the PR in the language of your `CLAUDE.md`.
- Code comments and screen text are in Japanese. Ask Claude to explain or translate them when you need to; you will replace the screen text with your own theme anyway.

## How to run

```bash
npm start
```

Open http://localhost:3000 in your browser. Press Ctrl+C in the terminal to stop.

`npm start` is the same as `node --env-file-if-exists=.env server.js`. On the first run, `data.db` is created with three sample items.

You may see these two lines when it starts. Both are fine:

- `.env not found. Continuing without it.` (you have not created `.env` yet; the AI feature runs on mock responses)
- `ExperimentalWarning: SQLite is an experimental feature ...` (Node.js's built-in SQLite is still marked experimental)

## Tests

```bash
node --test
```

This runs the tests under `test/`. The tests never call the real Gemini API.

## AI feature (Gemini)

Until you set a key, the AI feature returns mock responses. You can build the screens and the flow with the mock.

To try the real Gemini:

1. Get a key from Google AI Studio (https://aistudio.google.com/apikey) with your personal Google account
2. Copy `.env.example` to `.env` and put your key after `GEMINI_API_KEY=`
3. Restart the server

Notes:

- Never commit `.env` (it is in `.gitignore`). Do not share keys within the team; each person puts their own key in their own `.env`.
- The free tier has limits (requests per minute and per day). When you hit them, the screen says the limit was reached. Wait a little, or remove the key from `.env` and continue with the mock.
- Google uses what you send to the free tier, and what it returns, to improve its products. Do not send personal information or secrets.

## Files

| Path | What it is | Who edits it |
|---|---|---|
| `features/` | One file per feature (screen and API). Add a new file here for a new feature | The owner of the feature |
| `shared/nav.js` | The navigation at the top of the screen. Add one line when you add a feature | Everyone (conflicts happen here) |
| `lib/` | Shared tools (database, HTML, HTTP, calling Gemini) | Tell the team before changing |
| `public/style.css` | Look and feel | Anyone |
| `test/` | Tests run by `node --test` | The owner of the feature |
| `server.js` | The entry point that loads `features/`. You normally don't touch it | |
| `CLAUDE.md` / `CLAUDE.en.md` | The team's rules for Claude (Japanese / English). Fill in the blanks as a team | Everyone (through PRs) |
| `.claude/settings.json` | What Claude Code is not allowed to do (read `.env`, push to main, and so on) | |
| `.claude/skills/write-pr/` | How Claude writes a PR when you ask "Write a PR" | |

## Theme ideas (if you can't decide)

Your team is free to choose any theme, with three conditions:

1. It is different from what you will build in the development phase (the camp)
2. It is something you want to use or build
3. It is small enough that each person can add one feature in two hours

If you can't decide, pick one of these and adapt it. Each one starts by simply replacing "item". The feature split is just an example; one of the features should be an AI feature.

| Theme | What an item is | One feature per person (example) |
|---|---|---|
| Lost-and-found board for a lab or club | A lost thing (what, where, when) | Filter by place / mark "owner found" / sort by date found / AI tags features from the description |
| Watering log for the club room's plants | A plant (name, location, last watered) | A "watered" button / show days since last watering / who is on watering duty / AI gives a one-line care tip |
| Shared shopping list | Something to buy (name, quantity, who asked) | Mark "bought" / filter by who asked / move bought items to the bottom / AI groups items by store section |
| Shared list of recommended works (films, anime, games) | A work (title, type, comment) | Star rating / filter by type / "want to watch" mark and count / AI drafts a spoiler-free intro |
| Lab question box | A question (content, for whom, answer) | Answer field / filter answered or not / "I want to know too" count / AI checks for similar questions |

## What to copy into your camp repository

At the end of the exercise, you create a new private repository for the camp (the "base"). From this practice repository, have Claude copy only the parts that do not depend on your theme or technology.

| What | How |
|---|---|
| The "Development rules" part of `CLAUDE.md` (or `CLAUDE.en.md`) | Copy as is. Keep only the headings of the "What this app is" part and leave them blank (you fill them in on 12/12) |
| `.claude/settings.json` | Copy as is. Change the two `data.db` lines to the data file you will use at the camp (delete them if there is none) |
| `.claude/skills/write-pr/` | Copy as is |
| The `.env` lines of `.gitignore` | Copy only the lines that keep `.env` out of commits (add lines for your technology once you choose it) |
| Team agreements in the README | Only what your team decided, such as who reviews and when something may go into main |

Do not copy the code (`features/`, `lib/`, `server.js`, and so on), `package.json`, `.env.example`, or `data.db`. You choose your tech stack after 12/12.

## How to add a feature

1. Create a branch (for example, ask Claude: "Create a branch called `add-deadline`")
2. Create a new file in `features/` that exports `routes` (see `features/item-detail.js`)
3. Add one link to `shared/nav.js`
4. Check it by hand, add a test, and open a PR ("Write a PR")
