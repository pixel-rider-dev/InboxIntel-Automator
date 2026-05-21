from flask import Blueprint, request, jsonify
from backend.app.services.parser_service import extract_text_from_file
from backend.app.services.llm_service import extract_required_skills, extract_tasks, project_chat
from backend.app.models import TaskHistory
from backend.app import db

bp = Blueprint('main', __name__, url_prefix='/api')

@bp.route('/analyze-skills', methods=['POST'])
def analyze_skills():
    raw_text = request.form.get('text', '')
    uploaded_file = request.files.get('file')

    if uploaded_file:
        parsed_text = extract_text_from_file(uploaded_file)
        if not parsed_text:
            return jsonify({"error": "File parsing failed"}), 400
        raw_text += "\n" + parsed_text

    if not raw_text.strip():
        return jsonify({"error": "No text or file provided"}), 400

    skills = extract_required_skills(raw_text)
    return jsonify({"skills": skills, "combined_text": raw_text}), 200

@bp.route('/process-update', methods=['POST'])
def process_update():
    expertise_mapping = request.form.get('expertise_mapping', '')
    raw_text = request.form.get('text', '') 

    if not raw_text.strip() or not expertise_mapping.strip():
        return jsonify({"error": "Missing text or expertise mapping"}), 400
    
    tasks = extract_tasks(raw_text, expertise_mapping)
    if not tasks:
         return jsonify({"message": "No actionable tasks found", "tasks": []}), 200

    saved_tasks = []
    for t in tasks:
        new_task = TaskHistory(
            task_name=t.get('task_name', 'Unknown Task'),
            assignee=t.get('assignee', 'Unassigned'),
            deadline=t.get('deadline', 'None')
        )
        db.session.add(new_task)
        db.session.commit()
        saved_tasks.append(new_task.to_dict())

    return jsonify({"message": "Tasks assigned successfully", "tasks": saved_tasks}), 200

# New chat route
@bp.route('/chat', methods=['POST'])
def chat_route():
    question = request.form.get('question', '')
    context = request.form.get('context', '') 

    if not question.strip():
        return jsonify({"error": "No question provided"}), 400

    answer = project_chat(question, context)
    return jsonify({"answer": answer}), 200