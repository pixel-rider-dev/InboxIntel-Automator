// ==========================================
// 0. WHATSAPP TEAM NUMBERS (ENTER YOUR GROUP MEMBERS' NUMBERS HERE)
// ==========================================
const teamNumbers = {
    "usman": "923185640987r numbers in this format (Start with country code like 92, do not use + sign)
    "ali": "923111111111",
    "ahmad": "923498913992
    "member 4":"923333333333,
    "member 5":"923444444444"
};

window.sendWhatsAppTask = function(assigneeName, taskDetails, taskDeadline) {
    const cleanName = assigneeName.toLowerCase().trim();
    const phoneNumber = teamNumbers[cleanName];
    
    if (!phoneNumber) {
        alert(assigneeName + "'s phone number is not updated in the system. Please add the number in the code first.");
        return;
    }

    const deadline = taskDeadline || window.globalDeadline || "No Deadline";
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    
    const customMessage = `Assalam o Alaikum ${formattedName},\n\nThe AI Workflow Automation system has assigned you a new task:\n\n*Task:* ${taskDetails}\n\n*Deadline:* ${deadline}`;
    
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
};

// ==========================================
// 1. UI FUNCTIONS
// ==========================================
function generateMemberInputs(count) {
    const container = document.getElementById('dynamic-members');
    if (!container) return;
    container.innerHTML = ''; 
    for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Member ${i} Name`;
        input.className = 'member-name w-full p-2 border border-gray-300 rounded outline-none focus:border-[#c48f56]';
        container.appendChild(input);
    }
}

function renderSkillMapping(skills, membersList) {
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = ''; 
    if (!skills || skills.length === 0) return;

    skills.forEach(skill => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-100 mb-2';

        const skillLabel = document.createElement('span');
        skillLabel.className = 'font-bold text-[#2c3e2e] skill-name';
        skillLabel.textContent = skill;

        const selectBox = document.createElement('select');
        selectBox.className = 'expert-select w-1/2 p-2 border border-gray-300 rounded outline-none bg-white';
        
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '-- Select Expert --';
        selectBox.appendChild(defaultOpt);

        membersList.forEach(member => {
            const opt = document.createElement('option');
            opt.value = member;
            opt.textContent = member;
            selectBox.appendChild(opt);
        });

        wrapper.appendChild(skillLabel);
        wrapper.appendChild(selectBox);
        container.appendChild(wrapper);
    });
}

function renderTasks(tasks) {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    container.innerHTML = ''; 
    
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'bg-white p-5 rounded border border-gray-200 shadow-sm border-l-4 border-l-[#c48f56] flex flex-col justify-between h-full mb-3';
        card.innerHTML = `
            <div>
                <h3 class="font-bold text-[#2c3e2e] mb-2">${task.task_name || 'Unnamed Task'}</h3>
                <p class="text-sm text-gray-600 mb-1"><strong>Assignee:</strong> <span class="font-bold text-[#c48f56]">${task.assignee || 'Unassigned'}</span></p>
                <p class="text-sm text-gray-600 mb-4"><strong>Deadline:</strong> <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">${task.deadline || 'No Deadline'}</span></p>
            </div>
            <button 
                onclick="window.sendWhatsAppTask('${task.assignee}', '${task.task_name}', '${task.deadline}')" 
                class="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Notify via WhatsApp
            </button>
        `;
        container.appendChild(card);
    });
}

function setButtonState(btnId, isLoading, defaultText) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (isLoading) {
        btn.textContent = 'Processing...';
        btn.classList.add('opacity-70', 'cursor-not-allowed');
    } else {
        btn.textContent = defaultText;
        btn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
}

// ==========================================
// 2. MAIN LOGIC (Flask API Calling)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    const memberCountInput = document.getElementById('member-count');
    if (memberCountInput) {
        memberCountInput.addEventListener('input', function(e) {
            generateMemberInputs(e.target.value);
        });
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.setAttribute('type', 'button'); 
        analyzeBtn.addEventListener('click', async function(e) {
            e.preventDefault(); // Prevent page reload

            const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
            const fileInput = document.getElementById('file-upload');
            const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
            const memberInputs = document.querySelectorAll('.member-name');
            const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

            if (!projectText.trim() && !file) {
                alert("Please enter project text OR upload a PDF file first!");
                return;
            }

            setButtonState('analyze-btn', true, 'Processing AI...');

            try {
                const formData = new FormData();
                if (file) formData.append('file', file);
                if (projectText.trim()) formData.append('text', projectText);
                formData.append('members', JSON.stringify(membersList));

                const response = await fetch('https://inboxintel-automator.onrender.com/api/analyze-skills', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error("Server Response Error");

                const data = await response.json();
                
                if (data.skills && data.skills.length > 0) {
                    renderSkillMapping(data.skills, membersList);
                } else {
                    alert("AI did not return any skills. Please try again.");
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Connection failed. Please check the console for details.");
            } finally {
                setButtonState('analyze-btn', false, 'Analyze Required Expertise');
            }
        });
    }

    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.setAttribute('type', 'button');
        confirmBtn.addEventListener('click', async function(e) {
            e.preventDefault(); // Prevent page reload
            
            const userDeadline = prompt("Enter Deadline for all tasks (e.g., 2 Days or specific date):", "2 Days");
            let deadline = userDeadline || "2 Days";
            window.globalDeadline = deadline; 
            
            setButtonState('confirm-btn', true, 'Assigning Tasks...');
            
            try {
                const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
                const fileInput = document.getElementById('file-upload');
                const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
                const memberInputs = document.querySelectorAll('.member-name');
                const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

                const formData = new FormData();
                if (file) formData.append('file', file);
                if (projectText.trim()) formData.append('text', projectText);
                formData.append('members', JSON.stringify(membersList));

                const response = await fetch('https://inboxintel-automator.onrender.com/api/assign-tasks', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.tasks) {
                    renderTasks(data.tasks);
                }
            } catch (error) {
                console.error("Assign Error:", error);
                alert("Task assignment failed. Please check the backend connection.");
            } finally {
                setButtonState('confirm-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
});