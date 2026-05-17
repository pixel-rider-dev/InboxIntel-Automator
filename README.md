# AI Workflow Automation Agent (Group Task Manager)

## Project Overview
This project is an AI-powered workflow agent designed to streamline engineering team collaborations. It takes unstructured team updates (via multimodal inputs like Text, PDF, or Audio), extracts actionable tasks using a Large Language Model, and automatically creates project management tickets on GitHub.

## Core Features
* **Multimodal Input:** Supports raw text and PDF document parsing.
* **AI Task Extraction:** Uses OpenAI's advanced reasoning to identify specific tasks, assignees, and deadlines.
* **Multi-Step Execution:** Formats data into structured JSON before triggering external API calls.
* **API Integration:** Automatically pushes approved tasks to a GitHub repository as Issues.
* **Persistent Memory:** Logs all generated tasks in a local SQLite database for history tracking.

## Technology Stack
* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (Fetch API)
* **Backend:** Python 3, Flask (App Factory Pattern)
* **AI & Processing:** OpenAI API, PyPDF2
* **Database:** SQLite with SQLAlchemy ORM

## Local Setup Instructions

### 1. Backend Setup
1. Open the terminal and create a virtual environment:
   `python -m venv venv`
2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
3. Install dependencies:
   `pip install -r requirements.txt`
4. Add your `.env` file in the root directory with your `OPENAI_API_KEY` and `GITHUB_TOKEN`.

### 2. Frontend Setup (Tailwind CSS)
1. Navigate to the frontend directory:
   `cd frontend`
2. Install Node dependencies:
   `npm install`
3. Compile the CSS:
   `npm run build:css`

### 3. Run the Application
1. Return to the root directory and start the Flask server:
   `python backend/run.py`
2. Open `frontend/public/index.html` in your browser (or use Live Server) to access the UI.