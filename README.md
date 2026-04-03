# Farewell Budget Tracker

This app stores section and expense data in browser localStorage by default.

## Optional cloud storage (Google Apps Script)

You can sync data online by creating a Google Apps Script Web App and setting env variables.

1. Create a Google Sheet and copy its sheet ID.
2. Open Google Apps Script and create a new script project.
3. Paste this code into `Code.gs` and deploy as a Web App.

```javascript
const SHEET_ID = "PASTE_YOUR_SHEET_ID";
const SHEET_NAME = "budget_data";
const TOKEN = "change-this-secret-token";

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet
      .getRange("A1")
      .setValue(
        JSON.stringify({
          sections: [],
          expenses: [],
          updatedAt: new Date().toISOString(),
        }),
      );
  }
  return sheet;
}

function doGet(e) {
  const token = (e.parameter && e.parameter.token) || "";
  if (token !== TOKEN) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Unauthorized" }),
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getSheet();
  const raw = sheet.getRange("A1").getValue() || "{}";
  return ContentService.createTextOutput(raw).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (body.token !== TOKEN) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: "Unauthorized" }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const payload = {
      sections: Array.isArray(body.sections) ? body.sections : [],
      expenses: Array.isArray(body.expenses) ? body.expenses : [],
      updatedAt: body.updatedAt || new Date().toISOString(),
    };

    const sheet = getSheet();
    sheet.getRange("A1").setValue(JSON.stringify(payload));

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Create `.env` from `.env.example` and set:

```env
VITE_STORAGE_ENDPOINT=https://script.google.com/macros/s/your-app-id/exec
VITE_STORAGE_TOKEN=change-this-secret-token
```

5. Restart Vite dev server.

If `VITE_STORAGE_ENDPOINT` is empty, the app continues using localStorage only.
