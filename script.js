document.addEventListener('DOMContentLoaded', () => {
    const optimizeBtn = document.getElementById('optimize-btn');
    const resultsDiv = document.getElementById('results');
    const loader = document.getElementById('loader');
    const apiKeyInput = document.getElementById('apiKey');

    const currentResumeTextarea = document.getElementById('currentResume');
    const jobTitleInput = document.getElementById('jobTitle');
    const jobDescriptionTextarea = document.getElementById('jobDescription');

    const tailoredResumeCard = document.getElementById('tailoredResumeCard');
    const tailoredResumeContent = document.getElementById('tailoredResumeContent');
    const copyResumeBtn = document.getElementById('copyResumeBtn');
    const atsScoreCard = document.getElementById('atsScoreCard');
    const atsScore = document.getElementById('atsScore');
    const scoreReasoningCard = document.getElementById('scoreReasoningCard');
    const scoreReasoning = document.getElementById('scoreReasoning');

    const callGeminiAPI = async (prompt) => {
        const apiKey = apiKeyInput.value;
        if (!apiKey) {
            alert("Please enter your Google Gemini API Key.");
            return null;
        }

        // Using the v1beta endpoint which supports advanced generation configs
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "contents": [{
                        "parts": [{ "text": prompt }]
                    }],
                    // This section directly implements the logic from your Python snippet
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "responseSchema": {
                            "type": "object",
                            "properties": {
                                "TAILORED_RESUME": { "type": "string" },
                                "ATS_MATCH_SCORE": { "type": "integer" },
                                "SCORE_REASONING": { "type": "string" }
                            },
                            "required": ["TAILORED_RESUME", "ATS_MATCH_SCORE", "SCORE_REASONING"]
                        }
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const rawText = data.candidates[0]?.content?.parts[0]?.text;

            if (!rawText) {
                throw new Error("Gemini API response was empty or malformed.");
            }

            // The API returns a JSON string in the 'text' field, which we parse.
            return JSON.parse(rawText);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            resultsDiv.innerHTML = `<p style="color: red;"><strong>Error:</strong> ${error.message}. Please check your API key, model name, and ensure the API supports JSON mode.</p>`;
            return null;
        }
    };

    const optimizeResume = async () => {
        const resume = currentResumeTextarea.value.trim();
        const jobTitle = jobTitleInput.value.trim();
        const jobDesc = jobDescriptionTextarea.value.trim();

        if (!resume || !jobTitle || !jobDesc) {
            alert('Please fill in all resume and job description fields.');
            return;
        }

        // Clear previous results and show loader
        resultsDiv.innerHTML = '<p class="placeholder">Your optimized resume and analysis will appear here...</p>';
        tailoredResumeCard.style.display = 'none';
        atsScoreCard.style.display = 'none';
        scoreReasoningCard.style.display = 'none';
        loader.style.display = 'block';

        // NOTE: The "OUTPUT ONLY JSON" instruction is removed from the prompt,
        // as the generationConfig now forces the model to produce JSON.
        const prompt = `
You are an expert ATS (Applicant Tracking System) specialist and professional resume writer.
Your task is to rewrite the candidate's resume based on the TARGET JOB DESCRIPTION to maximize the ATS match score and appeal to human recruiters.

--- CANDIDATE'S CURRENT RESUME TEXT ---
${resume}

--- TARGET JOB TITLE ---
${jobTitle}

--- TARGET JOB DESCRIPTION ---
${jobDesc}

--- OUTPUT REQUIREMENTS ---
1.  **TAILORED_RESUME (Full Text):** Provide the complete, revised resume text.
    * **Heading Consistency:** MUST use the candidate's existing section headers EXACTLY as they appear (e.g., "Career Objective:", "TECHNICAL SKILLS:", "PROFESSIONAL EXPERIENCE:", "EDUCATION:").
    * **Summary Focus:** Rewrite any objective or summary to be a sharp, targeted professional summary (max 4-5 lines).
    * **Keyword Optimization:** Integrate critical hard and soft skills from the job description directly into the summary and experience bullet points.
    * **Impact and Action:** Every bullet point in the "PROFESSIONAL EXPERIENCE" section MUST start with a strong action verb (e.g., Led, Developed, Optimized, Reduced). Avoid vague phrases (e.g., "Responsible for," "Worked on").
    * **Quantifiable Results:** Focus on measurable outcomes (e.g., "Reduced latency by 40%", "Managed 10 TB data").
    * **Formatting:** All experience bullet points MUST start with the **middle-dot bullet character (•)**, followed by a space. Do not use dashes (-) or asterisks (*).
    * **Final Structure:** The resume must be clean text, ready to be copied into a document.

2.  **ATS_MATCH_SCORE (Integer):** Provide a numerical match percentage (0-100).
    
3.  **SCORE_REASONING (String):** Give a brief, professional explanation (2-3 sentences) for the score.
        `;

        const result = await callGeminiAPI(prompt);
        loader.style.display = 'none';

        if (result) {
            resultsDiv.innerHTML = ''; // Clear placeholder
            
            tailoredResumeContent.textContent = result.TAILORED_RESUME;
            tailoredResumeCard.style.display = 'block';

            atsScore.textContent = `${result.ATS_MATCH_SCORE}%`;
            atsScoreCard.style.display = 'block';

            scoreReasoning.textContent = result.SCORE_REASONING;
            scoreReasoningCard.style.display = 'block';
        } else {
            // Error message is displayed within callGeminiAPI
        }
    };
    
    const copyTailoredResume = () => {
        navigator.clipboard.writeText(tailoredResumeContent.textContent).then(() => {
            alert('Tailored resume copied to clipboard!');
        });
    };

    optimizeBtn.addEventListener('click', optimizeResume);
    copyResumeBtn.addEventListener('click', copyTailoredResume);
});