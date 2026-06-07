const SHEET_ID = "";
const SHEET_NAME = "Responses";
const NOTIFY_EMAIL = "";
const AUTO_CREATE_SPREADSHEET_NAME = "B.Tech Branch Fit Survey Responses";

function doGet() {
  const sheet = getSheet_();
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: "B.Tech survey response endpoint is running.",
      spreadsheetUrl: sheet.getParent().getUrl()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || "{}");
    const sheet = getSheet_();
    ensureHeaders_(sheet);

    const result = payload.result || {};
    const readiness = result.readiness || {};
    const ece = result.ece || {};

    const row = [
      new Date(),
      payload.studentName || "",
      payload.studentContact || "",
      result.recommendation || "",
      readiness.level || "",
      readiness.total || "",
      readiness.fundamentals || "",
      readiness.habits || "",
      ece.label || "",
      ece.detail || "",
      branchSummary_(result.branchScores || []),
      answerSummary_(payload.answers || {}),
      JSON.stringify(payload)
    ];

    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New B.Tech Branch Fit Survey Response",
        body: [
          "A new survey response was submitted.",
          "",
          "Student: " + (payload.studentName || "Not provided"),
          "Contact: " + (payload.studentContact || "Not provided"),
          "Recommendation: " + (result.recommendation || ""),
          "Readiness: " + (readiness.level || "") + " (" + (readiness.total || "") + "/42)",
          "ECE verdict: " + (ece.label || ""),
          "",
          "Branch scores:",
          branchSummary_(result.branchScores || []),
          "",
          "Answers:",
          answerSummary_(payload.answers || {})
        ].join("\n")
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet_() {
  const spreadsheet = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : getOrCreateSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function getOrCreateSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  const spreadsheet = SpreadsheetApp.create(AUTO_CREATE_SPREADSHEET_NAME);
  properties.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  return spreadsheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "Timestamp",
    "Student Name",
    "Contact",
    "Recommendation",
    "Readiness Level",
    "Readiness Score",
    "Fundamentals Score",
    "Study Habits Score",
    "ECE Verdict",
    "ECE Detail",
    "Branch Scores",
    "Answers",
    "Raw JSON"
  ]);
}

function branchSummary_(branches) {
  return branches
    .map(function(branch) {
      return branch.name + ": " + branch.percent + "% (" + branch.level + ")";
    })
    .join("\n");
}

function answerSummary_(answers) {
  return Object.keys(answers)
    .sort(function(a, b) { return Number(a) - Number(b); })
    .map(function(key) {
      return key + ": " + answers[key];
    })
    .join(", ");
}
