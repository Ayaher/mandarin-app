# Mandarin Study App Architecture

This document serves as a technical reference for the Mandarin Study Single Page Application (SPA). It outlines the system architecture, technology stack, data models, and key workflows.

## 1. Overview
The **Mandarin Study App** is a distraction-free tool designed to help users study Mandarin Chinese through sentence-by-sentence analysis of texts. It leverages **Google Gemini** for content generation (study materials, quizzes, writing prompts) and **Firebase** for persistence and authentication.

## 2. High-Level Architecture

The application is a client-side SPA hosted efficiently, interacting directly with Firebase services and the Google Gemini API.

```mermaid
graph TD
    User[User Browser]
    
    subgraph Frontend [Single Page Application]
        UI[UI Components (HTML/Tailwind)]
        Logic[App Logic (Vanilla JS)]
        Store[Local State]
    end
    
    subgraph Backend [Firebase]
        Auth[Firebase Authentication]
        Firestore[Cloud Firestore DB]
    end
    
    subgraph AI [Google Cloud]
        Gemini[Gemini API (Generative Language)]
    end
    
    subgraph External [CDNs]
        HanziWriter[Hanzi Writer]
        PinyinPro[Pinyin Pro]
        OpenCC[OpenCC JS]
    end

    User --> UI
    UI --> Logic
    Logic --> Store
    Logic --> Auth
    Logic --> Firestore
    Logic --> Gemini
    Logic --> HanziWriter
    Logic --> PinyinPro
    Logic --> OpenCC
```

## 3. Technology Stack

### Frontend
-   **Core**: HTML5, Vanilla JavaScript (ES6+), CSS3.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN).
-   **Icons**: [Lucide Icons](https://lucide.dev/).
-   **State Management**: Custom local state object (`app.state`) syncs with Firestore.

### Libraries & Utilities
-   **[Hanzi Writer](https://hanziwriter.org/)**: Stroke order animations and practice.
-   **[Pinyin Pro](https://github.com/zh-lx/pinyin-pro)**: Dynamic Pinyin generation.
-   **[OpenCC JS](https://github.com/nk2028/opencc-js)**: Traditional &Simplified Chinese conversion.

### Backend (Serverless)
-   **[Firebase Authentication](https://firebase.google.com/docs/auth)**: User identity management.
-   **[Cloud Firestore](https://firebase.google.com/docs/firestore)**: NoSQL database for syncing library and progress.

### Artificial Intelligence
-   **[Google Gemini API](https://ai.google.dev/)**:
    -   **Model**: `gemini-3-flash-preview` (Study Content, Quiz, Writing).
    -   **TTS**: `gemini-2.5-flash-preview-tts` (Text-to-Speech).

## 4. Data Model (Firestore)

All data is stored under the `users` collection, isolated by User UID.

### 4.1. User Settings & Index
**Path**: `users/{uid}/settings/data`
**Purpose**: Stores global user preferences and the lightweight index of the library (for fast loading).

```json
{
  "settings": {
    "hanziSize": 54,
    "latinSize": 18,
    "fontStyle": "sans",
    "wordColor": true,
    "geminiApiKey": "AIza...",
    "geminiVoice": "Aoede"
    // ...other UI preferences
  },
  "libraryIndex": [
    {
      "id": "uuid-string",
      "title": "Text Title",
      "preview": "First 100 chars...",
      "labels": ["🏷️", "⭐"],
      "sentenceCount": 12,
      "createdAt": "ISO-Date",
      "updatedAt": "ISO-Date",
      "isDone": false
    }
  ]
}
```

### 4.2. Library Item (Full Content)
**Path**: `users/{uid}/library/{textId}`
**Purpose**: Stores the heavy content of a specific text, including the raw text, parsed structure, and study progress.

```json
{
  "id": "uuid-string",
  "title": "Text Title",
  "content": "**Markdown Content**...",
  "isDone": false,
  "createdAt": "ISO-Date",
  
  // Progress/Study Data
  "quizData": { ... },       // Cached generated quiz
  "userAnswers": { "0": 1 }, // User's quiz answers
  "writingData": { ... },    // Cached writing prompt
  "writingResult": { ... },  // AI evaluation of writing
  "writingDraft": "User's draft text...",
  "contextData": { ... }     // Cached contextual examples
}
```

## 5. Key Workflows

### 5.1. Content Ingestion
1.  **Manual**: User pastes Markdown text.
2.  **AI Generation**: User inputs raw Mandarin text.
    -   App sends prompt to Gemini API (`generateStudyContent`).
    -   Gemini returns JSON with segmentation, pinyin, translation, and grammar.
    -   App converts JSON to internal Markdown format.

### 5.2. Study Mode
-   **Parsing**: Markdown is parsed into "Cards" (sentences).
-   **Rendering**:
    -   **Hanzi**: Rendered with dynamic coloring and stroke order capability.
    -   **Pinyin**: Generated via `pinyin-pro` or explicit markdown annotation.
    -   **Audio**: Fetched via Gemini TTS API upon request and cached in-memory.

### 5.3. Smart Features (Gemini Integration)
-   **Quiz Generation**:
    -   Sends full text to Gemini.
    -   Requests a 5-question multiple-choice quiz (HSK 4/5 level) in JSON format.
    -   Includes vocabulary and grammar usage questions.
-   **Writing Exercise**:
    -   Sends text snippets to Gemini.
    -   Requests a targeted writing prompt (Opinion, Personal Experience, etc.).
    -   Provides evaluation criteria.

## 6. Directory Structure
Since this is a simple SPA, the structure is flat:

```
/
├── index.html       # The entire application (Logic, UI, Styles)
├── .git/            # Version control
└── README.md        # (Optional) General info
```

Note: `index.html` contains ~4500 lines of code, encapsulating `HanziApp` class, Tailwind config, and UI templates.
