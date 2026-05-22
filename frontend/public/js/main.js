// ==========================================
// 1. WHATSAPP TEAM NUMBERS (CRASH-PROOF)
// ==========================================
window.sendWhatsAppTask = function(assigneeName, taskDetails, taskDeadline) {
    // APNE GROUP KE NUMBERS YAHAN LIKHEIN (92 se shuru karein, + na lagayen)
    const safeTeamNumbers = {
        "usman": "923185640987",
        "ali": "923111111111",
        "mohiz":923498913992,
        "fatima": "923333333333",
        "zain": "923444444444"
    };

    const cleanName = assigneeName.toLowerCase().trim();
    const phoneNumber = safeTeamNumbers[cleanName];
    
    if (!phoneNumber) {
        alert(assigneeName + "'s phone number is not updated in the system.");
        return;
    }

    const deadline = taskDeadline || window.globalDeadline || "No Deadline";
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    
    const customMessage = `Assalam o Alaikum ${formattedName},\n\nThe AI Workflow Automation system has assigned you a new task:\n\n*Task:* ${taskDetails}\n\n*Deadline:* ${deadline}`;
    const encodedMessage = encodeURIComponent(customMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
};

// ==========================================
// 2. MAIN LOGIC & UI (SCOPED TO PREVENT CLASHES)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Safe UI Functions ---
    function safeGenerateMemberInputs(count) {
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

    function safeRenderSkillMapping(skills, membersList) {
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

    function safeRenderTasks(tasks) {
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
                    Notify via WhatsApp
                </button>
            `;
            container.appendChild(card);
        });
    }

    function safeSetButtonState(btnId, isLoading, defaultText) {
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

    // --- Events (Number of Members) ---
    const memberCountInput = document.getElementById('member-count');
    if (memberCountInput) {
        memberCountInput.addEventListener('input', function(e) {
            safeGenerateMemberInputs(e.target.value);
        });
    }

    // --- Events (Analyze Button) ---
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.setAttribute('type', 'button'); 
        analyzeBtn.addEventListener('click', async function(e) {
            e.preventDefault(); 

            const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
            const fileInput = document.getElementById('file-upload');
            const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
            const memberInputs = document.querySelectorAll('.member-name');
            const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

            if (!projectText.trim() && !file) {
                alert("Please enter project text OR upload a PDF file first!");
                return;
            }

            safeSetButtonState('analyze-btn', true, 'Processing AI...');

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
                    safeRenderSkillMapping(data.skills, membersList);
                } else {
                    alert("AI did not return any skills. Please try again.");
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Connection failed. Please check the console.");
            } finally {
                safeSetButtonState('analyze-btn', false, 'Analyze Required Expertise');
            }
        });
    }

    // --- Events (Assign Tasks Button) ---
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.setAttribute('type', 'button');
        confirmBtn.addEventListener('click', async function(e) {
            e.preventDefault(); 
            
            const userDeadline = prompt("Enter Deadline for all tasks (e.g., 2 Days or specific date):", "2 Days");
            let deadline = userDeadline || "2 Days";
            window.globalDeadline = deadline; 
            
            safeSetButtonState('confirm-btn', true, 'Assigning Tasks...');
            
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
                    safeRenderTasks(data.tasks);
                }
            } catch (error) {
                console.error("Assign Error:", error);
                alert("Task assignment failed.");
            } finally {
                safeSetButtonState('confirm-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
});