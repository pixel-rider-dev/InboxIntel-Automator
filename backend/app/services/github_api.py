import os
import requests

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def create_github_issue(repo_owner, repo_name, title, body, assignee=None):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "title": title,
        "body": body
    }
    if assignee:
        data["assignees"] = [assignee]
        
    response = requests.post(url, json=data, headers=headers)
    return response.status_code == 201