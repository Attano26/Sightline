# Sightline

A market simulator for the facade and fenestration industry. You describe a move you are
considering. It works out who reacts, what they do about it, and what that turns into a few
months later.

Built for a physical, specification led, project based business. Aluminium systems, glass and
the building envelope. Not for software, and not for consumer goods.

## Files

| File | What it holds |
|---|---|
| `sightline.html` | The entire application. One file, no build step, no dependencies. |
| `PRD.md` | What this is, who it is for, and the twelve decisions it covers. |
| `ARCHITECTURE.md` | How the file is put together and why. |
| `DESIGN.md` | The visual language, tokens, and the rules that keep it consistent. |
| `PROMPTING.md` | The prompt layer, the output schema, and the honesty rules. |
| `RULES.md` | Working rules. Read before changing anything. |
| `MEMORY.md` | Running log. Updated after every validated change. |

## Running it

**Demo mode, no setup.** Open `sightline.html` in a browser. Three real facade simulations are
loaded and fully explorable with no key and no cost.

**Live mode.** Settings, paste a Google Gemini API key, press **Test key**. The key is stored in
this browser only and is sent to Google and nowhere else. There is no server.

Get a key at [aistudio.google.com](https://aistudio.google.com). An AI Studio key is unrestricted
by default. A key created in Google Cloud Console with an Android app restriction will always be
refused by a browser, which is the most common cause of a rejected key.

## Running it properly, with a local server

Opening the file directly works, but a real web origin is better: storage is more reliable and the
character encoding is served correctly. From the project root:

```
python -m http.server 8777 --directory Sightline
```

Then open `http://localhost:8777/sightline.html`. This is also what `.claude/launch.json` starts.

## Storage warning

Everything lives in the browser's local storage. That has two consequences worth knowing.

1. Opening the file directly from disk works in Chrome and Firefox but not in Safari, and not in
   an embedded preview pane. If you rely on it, host the file on any static host instead.
2. Clearing site data deletes everything. Use Settings, Export all, regularly.

## Cost

A simulation makes one API call and uses no web search. Web search is the expensive part of this
API, at roughly one and a third rupees per query, and this app never issues one. A simulation is
a few thousand tokens, a fraction of a rupee, and free on Google's free tier.

## What it is not

It produces exploratory reasoning, not forecasts, and nothing in it is market data. Verify before
any operating, financial or contractual decision.
