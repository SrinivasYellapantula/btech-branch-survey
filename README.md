# B.Tech Branch Fit Survey

This folder contains a mobile-friendly survey page that scores a student and recommends a safer B.Tech branch fit. It also gives an ECE-specific risk verdict.

## Files

- `index.html`: the survey app. It works as a single static page.
- `google-apps-script.js`: optional response endpoint for saving submissions into Google Sheets.

## Fastest Way To Use

Open `index.html` in a browser and take the survey. The result is calculated on the device and can be copied, shared, emailed, or sent through WhatsApp.

For a mobile link, upload `index.html` to any static host such as GitHub Pages, Netlify Drop, Vercel, Firebase Hosting, or your own website.

## Automatic Google Sheets Capture

1. Create a blank Google Sheet.
2. Copy the Sheet ID from its URL.
3. In Google Sheets, go to `Extensions > Apps Script`.
4. Paste the contents of `google-apps-script.js`.
5. Replace `PASTE_GOOGLE_SHEET_ID_HERE` with your Sheet ID.
6. Optional: set `NOTIFY_EMAIL` to your email address.
7. Click `Deploy > New deployment`.
8. Choose `Web app`.
9. Set `Execute as` to `Me`.
10. Set access to `Anyone`.
11. Deploy and copy the Web App URL.
12. Open `index.html`, find this config near the bottom, and paste the Web App URL:

```js
const CONFIG = {
  responseEndpoint: "PASTE_WEB_APP_URL_HERE",
  responseMode: "no-cors",
  ownerEmail: "",
  ownerWhatsApp: ""
};
```

After that, every submitted survey will append a row to the Google Sheet. The student still sees feedback immediately on the phone.

## Optional Share Targets

You can also set:

```js
ownerEmail: "your.email@example.com",
ownerWhatsApp: "919999999999"
```

Use the WhatsApp number in international format, with no plus sign, spaces, or hyphens.

## Important Note

The page cannot send responses directly into a ChatGPT conversation by itself. For no manual intervention after setup, connect the Google Sheets endpoint or another webhook service. The app will still compute and show the recommendation even without a backend.
