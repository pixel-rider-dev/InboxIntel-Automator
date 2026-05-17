import os
import json
from groq import Groq
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(basedir, '../../../.env')
load_dotenv(env_path)

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

def extract_required_skills(text):
    prompt = f"""
    Analyze this project update and list the core technical or non-technical roles/skills required to complete the tasks.
    CRITICAL RULES:
    1. Group similar or overlapping skills together (e.g., merge "Database Admin" and "SQL Database Specialist" into a single "Database Expert" role).
    2. Merge UI and Frontend roles into a single "Frontend/UI Developer" role if both are mentioned.
    3. Keep the list concise and broad. Do NOT extract more than 3 or 4 core roles. Avoid overly specific micro-roles.
    
    Return the result STRICTLY as a JSON object with a single key "skills" containing an array of strings.
    Text: "{text}"
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You are a logical project manager that outputs ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,  
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        return data.get("skills", [])
    except Exception as e:
        print(f"LLM Skill Extraction Error: {e}")
        return []

def extract_tasks(text, expertise_mapping):
    prompt = f"""
    You are an expert AI project manager. Read the project update and assign actionable tasks based strictly on the expertise mapping provided.
    Expertise Mapping: {expertise_mapping}
    CRITICAL RULES:
    1. Only assign tasks to the specific members listed in the mapping.
    2. Return strictly as a JSON object with a "tasks" key containing an array of objects (task_name, assignee, deadline).
    Text: "{text}"
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You are a helpful assistant that outputs ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        return data.get("tasks", [])
    except Exception as e:
        print(f"LLM Task Assignment Error: {e}")
        return []

# NAYA CHAT FUNCTION (Updated to stop hallucination and fix language)
def project_chat(question, context):
    prompt = f"""
    You are an intelligent project assistant for a team. Answer the user's question based strictly on the Project Context below.
    
    CRITICAL RULES:
    1. DO NOT hallucinate or guess names (like 'Aryan'). Only use the names provided in the Assigned Roles/Context.
    2. If the answer is not in the context, clearly say "Mujhe iski information nahi mili."
    3. Reply ONLY in casual, conversational Roman Urdu (e.g., use 'woh', 'hai', 'kaam'). DO NOT use pure Hindi words like 've', 'yadi', or 'hai ki'.
    4. Keep the answer short and to the point.
    
    Project Context: "{context}"
    User Question: "{question}"
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful team assistant. Answer strictly based on context in Roman Urdu."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1 # Temperature bilkul kam kar di taake apni taraf se batein na banaye
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM Chat Error: {e}")
        return "Sorry, server masla kar raha hai. Dobara try karein."