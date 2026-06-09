# CAPABILITIES.md — Tools / Skills / MCPs / Plugins / Connectors / Commands

The owner wants the **best tools** leveraged for the design build. Here's the live
inventory and what each is genuinely good for. (MCP servers connect/disconnect during
a session — if a tool isn't loaded, fetch it with **ToolSearch** by keyword first.)

## 🎨 Image / video generation (the cinematic asset engine)
> **PRIMARY = Midjourney.** The owner has Midjourney; it's best-in-class for cinematic
> stills — use it FIRST for every hero/background/texture asset. It has **no API/MCP**,
> so generate via the **Midjourney web app** (`midjourney.com/imagine`) driven by
> **Claude-in-Chrome**, or have the owner generate + drop the PNGs in. Use
> `nano_banana_pro` only as a fallback when MJ is unavailable. MJ prompts: `ASSETS.md`.

| Tool | Use it for | Notes |
|---|---|---|
| **Midjourney** (web/Discord; no MCP) | **PRIMARY** — all cinematic stills | Best quality. Drive via Claude-in-Chrome or owner-generated. |
| **Higgsfield `generate_image` / `nano_banana_pro`** | **Fallback** 4K stills | "top quality, 4K." Bake down to 1080p. |
| **Higgsfield `generate_image` / `soul_2`, `soul_cast`** | AI anchor avatar stills / character identity | for Phase 3b anchor look |
| **Higgsfield `generate_video` (`seedance_2_0`, `kling3_0`)** | Cinematic looping **background motion** + anchor video | keep bg loops low-res per `ROKU.md` |
| **Higgsfield `upscale_video` (Topaz)** | Upscale anchor video to 1080p/4K | for the foreground anchor segment |
| **Higgsfield `models_explore` / `show_generations` / `job_display`** | Pick models, poll jobs, fetch results | poll pending image/video jobs |
| **Canva** (`generate-design`, `export-design`, etc.) | **Asset FINISHING + assembly** (owner's preferred stack with MJ): import MJ raws, composite overlays (corner-brackets/glow), resize to exact Roku slot dims, export PNG. Also store screenshots + channel poster. | The compose/resize step after MJ; Claude Code can drive it via MCP or owner assembles. |

## 🧩 Design systems / specs
| Tool | Use it for |
|---|---|
| **Figma MCP** (`get_design_context`, `get_screenshot`, `create_design_system_rules`, Code Connect) | Build a component/design-system spec, tokens, mockups to translate into SceneGraph |
| **Skill `design:design-system`** | Establish tokens, scales, component rules |
| **Skill `design:design-critique`** | Adversarial review of a mockup/screenshot |
| **Skill `frontend-design:frontend-design`** | General UI craft guidance |
| **Skill `anthropic-skills:brand-guidelines`** | Lock brand voice/visual rules |
| **Skill `anthropic-skills:canvas-design` / `theme-factory` / `algorithmic-art`** | Generative/branded visual systems, theme palettes |
| **Skill `anthropic-skills:imagegen`** | Alt image-gen path |

## 🛠 Build / device / code
| Tool | Use it for |
|---|---|
| **Read / Edit / Write / Glob / Grep** | Edit BrightScript/XML, theme, assets |
| **Bash** | `package-roku.py`, sideload via `curl`, ECP launch, console capture, image bake-down (PIL/ffmpeg) |
| **BrighterScript** (`npx brighterscript --project bsconfig.json`) | Static validation (necessary, not sufficient) |
| **PowerShell** | Windows-side ops (the host is Windows) |

## 🔎 Research / docs
| Tool | Use it for |
|---|---|
| **WebSearch / WebFetch** | Roku design patterns, font licenses, examples |
| **context7** (`resolve-library-id`, `query-docs`) | Up-to-date library/API docs (e.g. `@vercel/blob`, SceneGraph refs) |

## 🔌 Connectors / apps (situational)
- **Vercel MCP** — deploy the backend, read logs (for the `/api/brief` anchor path).
- **GitKraken / git MCP** — branch/PR ops if preferred over raw git.
- **Slack / Notion / Linear** — if the owner wants status posts / task tracking synced.
- **Computer-use / Claude-in-Chrome** — drive the Roku developer portal upload, or
  pull visual references from the web, when API tools don't cover it.

## ⌨️ Slash commands / skills worth knowing
- `/code-review`, `/simplify` — review/clean your diffs before committing.
- `superpowers:*` (brainstorming, TDD, verification-before-completion) — process discipline.
- `frontend-design`, `design:*` — design execution.
- `/verify`, `/run` — drive + confirm the app actually works.

## How to use this well
1. **Generate assets** with `nano_banana_pro` (4K) → bake to slot dims (`ASSETS.md`).
2. **Optionally mock** the full look in Figma first (`design:design-system`) to align
   before editing BrightScript.
3. **Translate** to SceneGraph: Theme tokens → component XML → Animation nodes.
4. **Verify on device** every step (`BUILD.md`). Use `design:design-critique` on TV
   screenshots to iterate.
> Reminder: tool availability fluctuates. If a named tool 404s, `ToolSearch` it by
> keyword — connecting servers are searched once live.
