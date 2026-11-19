# GTA 6 Trophy Guide

![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/vjmunggahari-ui/gta6-trophy-guide-01-ono10/rank.svg)
![Reward](https://make.fun/badge/vjmunggahari-ui/gta6-trophy-guide-01-ono10/reward.svg)

Bounty: https://make.fun/bounty/gta6-trophy-guide-01

The complete trophy guide for **Grand Theft Auto VI** on PlayStation 5: all **55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 of them hidden until earned — with the official name, description and grade of each, a guide to it written in our own words, and a checklist that saves in your browser.

## What it does

- **All 55 trophies**, rendered from `app/data/trophies.json` (names, descriptions and grades are the official English text as shown on PlayStation Network).
- **Checklist with saved progress**: tick a trophy off and it stays ticked — progress is stored in `localStorage`, with a progress bar and a platinum counter (earned out of the 54 non-platinum trophies). A Reset progress button clears it (it asks first).
- **Search by trophy name**, grade and kind shown on every card (story, collectible, combat, driving, misc), hidden and missable flags.
- **Honest about the unknown**: 6 trophies whose unlock method no trusted source has confirmed yet are flagged "Method unconfirmed" instead of guessing.
- **Works offline**: plain static files under `app/`, no build step, no network requests at run time.

## How to run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Or open `app/index.html` through any static server with `app/` at its root. The program entrypoint is `main.ts` (Node 22):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

| Path | What it is |
| --- | --- |
| `main.ts` | Program entrypoint: copies `app/` + `screenshots/` to the output dir and writes `dossier.json` |
| `serve.ts` | Tiny static server for local testing (`node serve.ts`) |
| `vendor/makefun-frontend.ts` | Vendored make.fun library, copied from the kit unchanged |
| `app/index.html`, `app/style.css`, `app/app.js` | The guide itself (static, offline) |
| `app/data/trophies.json` | All 55 trophies with guides and per-trophy sources |
| `screenshots/1-checklist.jpg` | Smoke-test screenshot of the guide (1280×720) |
| `shots.json` | What each screenshot shows |
| `.makefun/owner.json` | Competition owner record |

## Sources

Trophy names, descriptions and grades: [Planet GTA 6](https://www.planetgta6.com/en/gta-6-trophies/) (official text as shown on PlayStation Network, taken 18 November 2026 from Exophase and cross-checked with PSNProfiles and TrueAchievements) and [Output Lag](https://outputlag.com/guides/gta-6-trophy-list/) (full list with grades, checked 18 November 2026). Guides are written in our own words for this entry and cite those sources per trophy.

## Notes for players

- There is no mission replay and no New Game Plus: keep a manual save at the start of every chapter and one before the final mission.
- One trophy can be missed: **Positive Mental Attitude** needs Lucia's balcony meditation in Chapter 1.
- Cheats disable trophies and saving — keep them off your trophy save.
- All 55 trophies are single-player; there are no online trophies.

Unofficial fan guide. Not affiliated with Rockstar Games, Sony or PlayStation.

## License

MIT — see [LICENSE](LICENSE).
