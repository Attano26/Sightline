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
| `PRD.md` | What this is, who it is for, and the sixteen decisions it covers. |
| `ARCHITECTURE.md` | How the file is put together and why. |
| `DESIGN.md` | The visual language, tokens, and the rules that keep it consistent. |
| `PROMPTING.md` | The prompt layer, the output schema, and the honesty rules. |
| `RULES.md` | Working rules. Read before changing anything. |
| `MEMORY.md` | Running log. Updated after every validated change. |
| `index.html` | A redirect, so the bare folder URL lands on the app. |
| `sw.js` | Offline worker. `VERSION` is bumped on every deploy, with `BUILD` in the app. |
| `manifest.webmanifest` | Install metadata and the four launcher icons. |
| `favicon.svg` | Browser tab icon. Carries its own `prefers-color-scheme` block. |
| `icon-*.png` | Launcher icons: any, maskable, and monochrome for Android themed icons. |
| `logo.svg` | The mark, `fill="currentColor"`, cloned into the rail and onboarding. |
| `Logo Vector.*` | The originals every icon above is generated from. Not served. |

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

Optional. Press **Continue with Google** during onboarding, or in Settings, and your work follows
you between devices. There is nothing for you to configure.

Your data goes into **your own Google Drive** as a single file, `sightline-data.json`, that this app
creates. It can read and write that one file and nothing else of yours. There is no server anywhere
in this, and nothing passes through anyone else. Two people using this app share nothing: each
signs in as themselves, and each file lives in its owner's own Drive.

**What syncs:** workspaces, facts, behaviour, simulations and signals.
**What does not:** your Gemini key, deliberately. An API key does not belong in a file that travels
between devices, even a private one. It also means nobody can spend your quota.

**If both devices changed** since the last sync, it stops and asks which to keep, showing what each
side holds and when it changed. It will not guess, because silently discarding a day of work to
avoid a dialogue is not a trade worth making.

## Publishing this for other people

The app ships one OAuth client, in `APP_CLIENT_ID`. A client ID is not a secret, it is designed to
sit visibly in the page, and that is exactly why creating it is the publisher's job once rather than
every user's job forever. An earlier version asked each person to make their own, which is developer
setup handed to the wrong person.

Two things gate other people signing in.

**The scope must stay non-sensitive.** This app requests `drive.file` and nothing else. Google
classifies it as non-sensitive, and an app using only non-sensitive scopes is not required to
complete verification. `drive.appdata`, which this used previously, is *sensitive*: it would hide
the file rather than putting it in view, at the cost of a verification review before anyone outside
a hand-written tester list could sign in. Visible file, open sign in, was the better trade.

If the Google Auth Platform **Data access** page still lists `drive.appdata`, remove it. A declared
sensitive scope forces verification even when the code never asks for it.

**The consent screen must be published.** While it is in Testing, only accounts on the tester list
get in, and everyone else sees *"has not completed the Google verification process"*, which is
Google's wording for "this app is in Testing" and not a request for you to do anything.

- **Google Auth Platform, Audience, Test users**: add up to 100 addresses by hand. Immediate.
- **Google Auth Platform, Audience, Publish app**: anyone with a Google account. With only
  non-sensitive scopes declared this completes immediately, with no review.

Either way the data isolation is identical. Publishing only removes the allowlist.

Optionally, **brand verification** puts an app name and logo on the consent screen in place of the
bare origin. That one is a real review, it is purely cosmetic, and sign in works without it.

### Hosting your own copy

1. At **console.cloud.google.com**, pick or create a project.
2. **APIs and Services**, then **Library**. Search **Google Drive API**, press Enable.
3. **Google Auth Platform**, **Data access**: add `.../auth/drive.file`, and nothing sensitive.
4. **Clients**, **Create client**, type **Web application**.
5. Under **Authorised JavaScript origins** add your origin exactly, for example
   `https://yourname.github.io`, with no trailing slash and no path. Add
   `http://localhost:8777` too if you want sign in to work against the local server.
6. Put the Client ID in `APP_CLIENT_ID` in `sightline.html`. Copy it with the **copy button**, never
   by selecting the text, because the console list displays it shortened and a shortened ID returns
   `401 invalid_client`.
7. **Audience**, **Publish app**.

### Reading Google's refusals

| What Google says | What it actually means |
|---|---|
| `401 invalid_client` | The client ID sent was not found. Almost always a truncated copy. |
| `redirect_uri_mismatch` | This origin is not on the client's JavaScript origins list. |
| `403 access_denied` plus "has not completed the Google verification process" | The consent screen is in Testing and this account is not a tester. |

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
