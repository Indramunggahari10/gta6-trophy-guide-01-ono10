# GTA 6 Trophy Guide — All 55 Trophies, Platinum Roadmap & Checklist

[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/vjmunggahari-ui/gta6-trophy-guide-01-ono10/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/vjmunggahari-ui/gta6-trophy-guide-01-ono10/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

**The complete trophy guide for Grand Theft Auto VI on PlayStation 5 — every trophy, a roadmap to the Platinum, and a checklist that remembers your progress.**

Built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01): an offline web app that opens in a desktop browser and works with the network off. No account, no server, no build step — just open it and start ticking trophies off.

## At a glance

| | |
| --- | --- |
| **Trophies** | **55** — 1 Platinum · 2 Gold · 6 Silver · 46 Bronze |
| **Hidden trophies** | 28, revealed only once earned (or when you turn spoilers off) |
| **Missable** | 1 confirmed — see [Missable trophies](#missable-trophies) |
| **Method unconfirmed** | 7 trophies flagged honestly instead of guessed |
| **Online trophies** | 0 — all 55 are single-player |
| **Progress** | Saved in your browser, exportable and importable as JSON |
| **Offline** | Yes — plain static files under `app/`, no network requests at run time |

Every trophy carries its official name, description and grade (the official English text as shown on PlayStation Network), plus a guide written in our own words, with per-trophy sources. Nothing is copied from other guides.

## What the guide does

### Track — a checklist that saves itself

- Tick a trophy off and it stays ticked: progress lives in `localStorage`, with a progress bar and a platinum counter (earned out of the 54 non-platinum trophies).
- A **Reset progress** button clears it — and asks first, so a stray click never wipes a run.
- **Export / import**: export downloads your earned trophies as JSON; import restores them, ignores unknown ids, and reports how many were restored. Move your progress between browsers or keep a backup before a risky chapter.

### Find — search and filters

- **Search** by trophy name or description.
- Every card shows grade and kind — story, collectible, combat, driving, misc — plus hidden and missable flags.
- **Kind filters with counts**: All, Story, Collectibles, Combat, Driving, Misc, Missable, and Online (0 — the game has no online trophies), so you can focus on exactly the trophies you are hunting.

### Stay unspoiled — spoiler setting (on by default)

Story trophies you have not earned yet show behind a placeholder: no name, no description, no guide, until you earn them. Earned story trophies always show in full. The choice is saved in `localStorage`, so it survives a restart.

### Plan — the Platinum roadmap

Six stages built from the trophy data, with per-stage earned counts:

1. **Story** — play through the campaign, watching for the one missable trophy.
2. **Collectibles** — sweep up everything the world hides.
3. **Combat and driving** — skill-based trophies, practised deliberately.
4. **World and money cleanup** — side activities and economy goals.
5. **100% completion** — the last checklist items before the end.
6. **Platinum** — the final trophy, earned when the other 54 are done.

The roadmap tells you what to do now and what can wait, so you never grind collectibles before you have finished the story trophies that gate them.

## Missable trophies

Only one trophy is confirmed missable:

| Trophy | How to not miss it |
| --- | --- |
| **Positive Mental Attitude** | Lucia's balcony meditation in **Chapter 1** — do it before the chapter ends. |

This comes from [Output Lag](https://outputlag.com/guides/gta-6-trophy-list/) (checked 19 November 2026), which lists exactly one missable trophy. [Planet GTA 6](https://www.planetgta6.com/en/gta-6-trophies/) says no reliable missable list exists yet — so the guide flags what is confirmed and does not invent more.

**Because there is no mission replay and no New Game Plus**, keep a manual save at the start of every chapter and one before the final mission. That is the only safety net for the missable trophy.

## Honest about the unknown

**7 trophies** whose unlock method no trusted source has confirmed yet are flagged **"Method unconfirmed"** in the guide. The guide says so plainly rather than guessing — a wrong guess costs a player a playthrough; an honest flag costs them nothing.

## Quick start

Serve it locally:

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Or open `app/index.html` through any static server with `app/` at its root. The program entrypoint is `main.ts` (Node 22):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

No build step, no dependencies to install, no network requests at run time.

## Screenshots

| Screenshot | What it shows |
| --- | --- |
| `screenshots/1-checklist.jpg` | The checklist view (1280×720) |
| `screenshots/2-filters.jpg` | Kind-filter view: Collectibles filter active (1280×720) |
| `screenshots/3-spoiler.jpg` | Spoiler-on view: story trophies hidden until earned (1280×720) |
| `screenshots/4-roadmap.jpg` | Platinum roadmap view (1280×720) |

See `shots.json` for what each screenshot shows.

## Files

| Path | What it is |
| --- | --- |
| `main.ts` | Program entrypoint: copies `app/` + `screenshots/` to the output dir and writes `dossier.json` |
| `serve.ts` | Tiny static server for local testing (`node serve.ts`) |
| `vendor/makefun-frontend.ts` | Vendored make.fun library, copied from the kit unchanged |
| `app/index.html`, `app/style.css`, `app/app.js` | The guide itself (static, offline) |
| `app/data/trophies.json` | All 55 trophies with guides and per-trophy sources |
| `screenshots/` | 4 screenshots, real renders of the guide's own code |
| `shots.json` | What each screenshot shows |
| `.makefun/owner.json` | Competition owner record |

## Sources

- Trophy names, descriptions and grades: [Planet GTA 6](https://www.planetgta6.com/en/gta-6-trophies/) (official text as shown on PlayStation Network, taken 18 November 2026 from Exophase and cross-checked with PSNProfiles and TrueAchievements) and [Output Lag](https://outputlag.com/guides/gta-6-trophy-list/) (full list with grades, checked 18 November 2026).
- Guides are written in our own words for this entry and cite those sources per trophy. Other guides may be drawn on and cited, never copied.

## Notes for players

- **There is no mission replay and no New Game Plus**: keep a manual save at the start of every chapter and one before the final mission.
- **One trophy can be missed**: **Positive Mental Attitude** needs Lucia's balcony meditation in Chapter 1.
- **Cheats disable trophies and saving** — keep them off your trophy save.
- **All 55 trophies are single-player**; there are no online trophies.

Unofficial fan guide. Not affiliated with Rockstar Games, Sony or PlayStation.

## License

MIT — see [LICENSE](LICENSE).
