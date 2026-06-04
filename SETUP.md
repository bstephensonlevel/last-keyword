# The Last Keyword — Setup Guide

SMX Advanced 2026 booth activation. Three moving parts:

1. **`index.html`** — the form attendees hit from the QR code (mobile).
2. **`Code.gs`** — a Google Apps Script that saves submissions to a Google Sheet and feeds the display.
3. **`display.html`** — the gallery screen that runs on the tablet inside the case.

`config.js` is the one file you edit to wire it all together.

---

## How the experience flows

1. Attendee scans the QR code, lands on the form, and enters their "last keyword."
2. On submit, the row is written to your Google Sheet.
3. The tablet display polls the sheet every few seconds. When a new keyword arrives, it **spotlights that keyword for 5 minutes** ("Now on display") so the attendee can photograph their moment.
4. After the 5 minutes (or whenever nothing new has come in), the display **rotates through every submitted keyword in random order, ~15 seconds each**, mixed with a set of curated "historic" keywords so the case is never empty between submissions.
5. If a newer keyword is submitted while one is being featured, the newest takes the spotlight and the 5-minute timer resets.

All timings live at the bottom of `config.js` (`FEATURE_MS`, `ROTATE_MS`, `POLL_MS`) if you want to tune them on site.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.new](https://sheets.new) and name it something like **Last Keyword — SMX 2026**.
2. Leave it empty. The script creates the headers for you.

## Step 2 — Add the Apps Script

1. In the sheet: **Extensions > Apps Script**.
2. Delete the starter code, paste in the full contents of **`Code.gs`**, and click the save icon.
3. In the function dropdown, select **`setup`** and click **Run**.
4. Google will ask you to authorize. Choose your account, click **Advanced > Go to (project) (unsafe)** if prompted (this is normal for your own script), and **Allow**. This creates the `Submissions` tab with headers.

## Step 3 — Deploy the script as a Web App

1. Top right: **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** Last Keyword
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**, authorize again if asked, and **copy the Web app URL** (it ends in `/exec`).

> Important: any time you edit `Code.gs`, the live URL does **not** update automatically. Go to **Deploy > Manage deployments**, click the pencil, set **Version: New version**, and **Deploy**. The `/exec` URL stays the same.

## Step 4 — Wire up `config.js`

Open `config.js` and set:

- `SCRIPT_URL` — paste the `/exec` URL from Step 3.
- `BOOTH_URL` — the public address where the form will live (used in the LinkedIn share caption).

That's the only file you need to touch.

## Step 5 — Publish the site

The folder is a plain static site (`index.html`, `display.html`, `config.js`, and `/assets`). It drops straight into your `events.level.agency` Vercel router pattern.

> Before you publish to Vercel, loop in **Dave Brong** to run it past our deployment best practices. Quick check, keeps us consistent.

Once live:
- The **form** is your QR target (e.g. `https://events.level.agency/last-keyword/`).
- The **display** is `.../last-keyword/display.html`.

Generate the QR code from the form URL and drop it on the booth side panel.

## Step 6 — Run the tablet

1. Open `display.html` in the tablet browser, full screen.
2. Lock it down so nobody can wander off the page:
   - **iPad:** Settings > Accessibility > **Guided Access**, then triple-click to lock the page.
   - **Android:** **Screen pinning**.
3. Set the tablet's auto-lock / sleep to **Never** for the show.
4. The display starts rotating on the curated keywords immediately, then picks up real submissions as they land.

---

## Testing before the show

- You can open `index.html` and `display.html` locally before `SCRIPT_URL` is set. The form will show the full success flow without saving, and the display runs on the seed keywords in "preview mode" (you'll see a small note at the bottom). Once `SCRIPT_URL` is filled in, both go live.
- Do a real end-to-end test from your phone once deployed: submit a keyword, watch it appear within ~10 seconds and hold for 5 minutes.

## Good to know

- **What's captured:** just the keyword and a timestamp. No names, email, or company are collected, so there's no personal data to manage. Every keyword lands in the `Submissions` tab.
- **LinkedIn caption:** LinkedIn no longer lets us pre-fill post text from a share link, so the "Share on LinkedIn" button opens the share dialog with the booth URL and copies the caption to the attendee's clipboard to paste. The "Copy caption" button does the same on its own.
- **Logo:** the form uses Level's logo on white; the display uses a white version on the dark gallery background. Both are in `/assets/brand`.
- **Reuse:** for the next conference, change the hashtag in `SHARE_CAPTION`, swap the seed keywords, point `BOOTH_URL` at the new path, and reuse the same sheet or start a fresh one.
