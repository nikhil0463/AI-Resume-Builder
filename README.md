# AI Resume Builder

A lightweight, client-side web app that helps you optimize a resume for a specific job description using Google's Gemini generative API. The app accepts your current resume and a target job description, calls the Gemini model to produce a tailored resume, an ATS-style match percentage, and a short reasoning note.

This repository contains only static frontend files (HTML/CSS/JS). No server component is included — the app calls the Gemini REST endpoint directly from the browser using the API key you enter at runtime.

## Features

- Paste your current resume text and the target job description.
- Enter your Google Gemini API key (not stored — used only in your browser session).
- Generate a tailored resume that preserves your original section headings and optimizes content for ATS and human readers.
- Get an ATS match score (0–100) and a 2–3 sentence explanation of the score.
- Copy the tailored resume to your clipboard with one click.

## Files

- `index.html` — the web app UI.
- `style.css` — styles for the UI.
- `script.js` — app logic and Gemini API integration.
- `README.md` — this file.

## How it works (brief)

- The UI collects: your current resume text, the target job title and job description, and a Google Gemini API key.
- `script.js` builds a prompt and sends a POST request to the Gemini generateContent endpoint, asking the model to return a JSON object containing `TAILORED_RESUME`, `ATS_MATCH_SCORE`, and `SCORE_REASONING`.
- The app parses the JSON response and displays the tailored resume, score, and reasoning.

## Quickstart — run locally (recommended)

Notes:

- Because the app makes cross-origin requests to Google APIs from the browser, some environments (for example opening `index.html` with the `file://` protocol) may produce CORS or fetch issues. It's recommended to serve the files over a local HTTP server.

Using Python (if installed):

```pwsh
# from the project folder
python -m http.server 5500
# then open http://localhost:5500 in your browser
```

Using Node (if you have npm):

```pwsh
npx http-server -p 5500
# then open http://localhost:5500 in your browser
```

Or simply open `index.html` in your browser if you prefer; just be aware of potential CORS restrictions.

## Usage

1. Open the app in your browser.
2. Obtain a Google Gemini API key (the app links to a get-started page). Be aware of billing and access controls for the account you use.
3. Paste your current resume into the "Your Current Resume Text" area.
4. Enter the target job title and paste the full job description.
5. Enter your API key in the "Google Gemini API Key" field.
6. Click "Optimize My Resume". Wait for the model to respond — very large inputs may take longer.
7. Review the Tailored Resume, ATS Match Score, and Score Reasoning. Click "Copy Tailored Resume" to copy the result to your clipboard.

## Inputs / Outputs (contract)

- Inputs:
	- currentResume (string): full resume text.
	- jobTitle (string)
	- jobDescription (string)
	- apiKey (string): Google Gemini API key entered at runtime.
- Outputs (displayed by the app):
	- TAILORED_RESUME (string): complete revised resume text.
	- ATS_MATCH_SCORE (integer 0–100)
	- SCORE_REASONING (string): 2–3 sentence explanation.
- Error modes: missing/invalid API key, network/CORS errors, Gemini returning unexpected/malformed output.

## Development notes

- The Gemini request is in `script.js` — change the `API_URL` or `model` there if you want to try different models or endpoints.
- The app currently uses the generation config and expects the model to return structured JSON inside the `candidates[0].content.parts[0].text` field; if the model or endpoint you select doesn't support JSON schema enforcement, the response may be plain text and parsing will fail.

### Common edits you might make

- Change the model name or choose a different endpoint to match your Google Cloud project.
- Improve user feedback in `script.js` (e.g., better loader, retry logic, input validation, chunking very large resumes).

## Troubleshooting

- "No response / malformed response": Confirm your API key is valid, has access to the Gemini model, and that you have billing enabled. Open the browser console to see the error details.
- "CORS / network error": Serve the site over HTTP (see Quickstart) or check browser extensions that might block network requests.
- "Model returned plain text instead of JSON": Some Gemini models or configurations may not support schema-enforced JSON output. Try a model/version that supports structured JSON outputs or simplify the prompt.

## Security & privacy

- The app performs all requests from your browser and does not store the API key or your resume. However, your resume text and API key are sent to Google's APIs (per Google's terms and billing). Do not use production or sensitive credentials you can't afford to expose.

## License

This project is provided under the MIT License. See the LICENSE file (or add one) if you want to include licensing metadata.

## Acknowledgements

- Built as a simple hobby project to demonstrate how to pair a resume with a generative model for ATS optimization.



If you want any of those, tell me which and I'll implement them.
AI Resume Builder
