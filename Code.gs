/**
 * THE LAST KEYWORD — Google Apps Script backend
 * --------------------------------------------------------------
 * doPost  -> form (index.html) writes a submission to the sheet
 * doGet   -> display (display.html) reads all keywords (JSONP)
 *
 * Setup steps are in SETUP.md. Short version:
 *   1) Open the Google Sheet that should hold submissions.
 *   2) Extensions > Apps Script. Paste this file in. Save.
 *   3) Run setup() once (authorize when prompted) to create headers.
 *   4) Deploy > New deployment > Web app:
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the /exec URL into config.js (SCRIPT_URL).
 * --------------------------------------------------------------
 */

var SHEET_NAME = 'Submissions';
var HEADERS = ['Timestamp', 'Keyword'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Run this once from the editor to initialize the sheet + grant permissions. */
function setup() {
  getSheet_();
}

/** Form submissions (no-cors form-encoded POST from index.html). */
function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      (p.keyword || '').toString().slice(0, 120)
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Display reads all entries. Supports JSONP via ?callback=fn (used by display.html). */
function doGet(e) {
  var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;
  var payload;
  try {
    var sheet = getSheet_();
    var lastRow = sheet.getLastRow();
    var entries = [];
    if (lastRow > 1) {
      // columns: A Timestamp, B Keyword
      var values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        var kw = (row[1] || '').toString().trim();
        if (!kw) continue;
        var ts = row[0];
        var iso = (ts instanceof Date) ? ts.toISOString() : new Date(ts).toISOString();
        entries.push({ timestamp: iso, keyword: kw });
      }
    }
    payload = { ok: true, entries: entries };
  } catch (err) {
    payload = { ok: false, error: String(err), entries: [] };
  }
  return callback ? jsonp_(callback, payload) : json_(payload);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(callback, obj) {
  // basic guard on the callback name
  var safe = String(callback).replace(/[^a-zA-Z0-9_$.]/g, '');
  return ContentService
    .createTextOutput(safe + '(' + JSON.stringify(obj) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
