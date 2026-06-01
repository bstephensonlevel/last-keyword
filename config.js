/* ============================================================
   THE LAST KEYWORD — shared config
   Edit this ONE file after you deploy the Google Apps Script.
   Both the form (index.html) and the display (display.html) read it.
   ============================================================ */

window.LK_CONFIG = {
  // Paste your Apps Script Web App URL here (ends in /exec).
  // See SETUP.md, Step 4.
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwLxVaEtqN1u-4iV_A0lJqfm7ykXp-qPhF1c3_sFU00njOfbtXFLnd4_69qb9vE3Jx8/exec",

  // Public URL of the form, used in the LinkedIn share caption.
  // Update to your live booth URL (e.g. https://events.level.agency/last-keyword).
  BOOTH_URL: "https://last-keyword.vercel.app/",

  // Pre-filled caption attendees can copy for LinkedIn.
  SHARE_CAPTION:
    "My last keyword is on display at the @LevelAgency booth at #SMXAdvanced. Stop by to see yours.",

  // ---- Display timing (display.html) ----
  FEATURE_MS: 5 * 60 * 1000, // hold a newly submitted keyword for 5 minutes
  ROTATE_MS: 15 * 1000,      // each keyword shows ~15s in rotation
  POLL_MS: 8 * 1000,         // how often the display checks for new entries

  // Curated "historic" keywords that idle in the case so it's never empty
  // and stays alive when booth traffic is low. Pulled from the activation brief.
  SEED_KEYWORDS: [
    "cheap car insurance",
    "weather near me",
    "best running shoes",
    "how to tie a tie",
    "pizza near me open now",
    "is it going to rain today",
    "how to screenshot on mac",
    "flights to anywhere",
  ],
};
