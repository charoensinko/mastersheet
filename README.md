# Test Web App - Google Sheets Dashboard

This web application displays realtime data from your Google Sheets.

## Quick Start

1.  **Open the Project**: You are currently in the project folder.
2.  **Edit Configuration**:
    *   Open `script.js`.
    *   Find the line: `const API_URL = 'REPLACE_WITH_YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_URL';`
    *   Replace the text inside the quotes with your actual Google Apps Script Web App URL (from the "Deploy" step).
3.  **Run**:
    *   Since this is a static site (HTML/CSS/JS), you can just double-click `index.html` to open it in your browser.
    *   For a better experience, use a local server (e.g., "Live Server" extension in VS Code) or upload to GitHub Pages.

## How it Works

*   **HTML**: Provides the layout.
*   **CSS**: Handles the glassmorphism design and responsive layout.
*   **JS**: Fetches JSON data from your text output script and builds the table dynamically.

## Troubleshooting

*   **"Failed to load data"**: Check if your Google Apps Script is deployed as "Web App" and access is set to "Anyone".
*   **CORS Errors**: Ensure the script returns valid JSON and `doGet()` is set up correctly.
