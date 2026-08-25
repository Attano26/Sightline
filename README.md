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

## Syncing across devices, with Google Drive

Optional. Press **Continue with Google** during onboarding, or in Settings, and your work
follows you between devices. There is nothing to configure.

Your data goes into **your own Google Drive** as a single file, `sightline-data.json`, that this
app creates. It can read and write that one file and nothing else of yours. There is no server
anywhere in this, and nothing passes through anyone else.

**What syncs:** workspaces, facts, behaviour, simulations and signals.
**What does not:** your Gemini key, deliberately. An API key does not belong in a file that travels
between devices, even a private one.

**If both devices changed** since the last sync, it stops and asks which to keep, showing what each
side holds and when it changed. It will not guess, because silently discarding a day of work to
avoid a dialogue is not a trade worth making.

### If you are hosting your own copy

The app ships with one OAuth client, tied to the origin it is published on. A client ID is not a
secret, which is exactly why this is the publisher's job and not the user's. Serving the file from
your own origin means bringing your own, once:

1. At **console.cloud.google.com**, pick or create a project.
2. **APIs and Services**, then **Library**. Search **Google Drive API**, press Enable.
3. **OAuth consent screen**. External, name it, and add the `drive.file` scope. That scope is not
   sensitive, so the consent screen can be published without a verification review and anyone can
   then sign in.
4. **Credentials**, **Create credentials**, **OAuth client ID**, type **Web application**.
5. Under **Authorised JavaScript origins** add your origin exactly, for example
   `https://yourname.github.io`, with no trailing slash.
6. Put the Client ID in `APP_CLIENT_ID` near the top of the sync section of `sightline.html`, or
   paste it into Settings on each device.

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
