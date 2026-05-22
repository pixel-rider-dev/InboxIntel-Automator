// ==========================================
// 1. TEAM NUMBERS (GLOBAL)
// ==========================================
window.teamNumbers = {
    "usman": "923185640987",
    "mohiz":"923498913992",
    "ahmad": "923222222222",
    "fatima": "923333333333",
    "zain": "923444444444"
};

window.sendWhatsAppTask = function(assigneeName, taskDetails, taskDeadline) {
    const cleanName = assigneeName.toLowerCase().trim();
    const phoneNumber = window.teamNumbers[cleanName];
    
    if (!phoneNumber) {
        alert(assigneeName + " ka phone number system mein nahi hai.");
        return;
    }
    const deadline = taskDeadline || window.globalDeadline || "No Deadline";
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const customMessage = `Assalam o Alaikum ${formattedName},\n\nAI Workflow Automation system ne task assign kiya hai:\n\n*Task:* ${taskDetails}\n\n*Deadline:* ${deadline}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`, "_blank");
};

// ==========================================
// 2. UI FUNCTIONS (GLOBAL)
// ==========================================
window.generateMemberInputs = function(count) {
    const container = document.getElementById('dynamic-members');
    if (!container) { 
        alert("System Error: 'dynamic-members' wala box HTML mein nahi mil raha!"); 
        return; 
    }
    container.innerHTML = ''; 
    for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Member ${i} Name`;
        input.className = 'member-name w-full p-2 border border-gray-300 rounded outline-none focus:border-[#c48f56]';
        container.appendChild(input);
    }
};

window.renderSkillMapping = function(skills, membersList) {
    const container = document.getElementById('skills-container');
    if (!container) { 
        alert("System Error: 'skills-container' wala box HTML mein nahi mil raha!"); 
        return; 
    }
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
};

window.renderTasks = function(tasks) {
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
            <button onclick="window.sendWhatsAppTask('${task.assignee}', '${task.task_name}', '${task.deadline}')" class="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-2 px-4 rounded">
                Notify via WhatsApp
            </button>
        `;
        container.appendChild(card);
    });
};

window.setButtonState = function(btnId, isLoading, defaultText) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (isLoading) {
        btn.textContent = 'Processing...';
        btn.classList.add('opacity-70', 'cursor-not-allowed');
    } else {
        btn.textContent = defaultText;
        btn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
};

// ==========================================
// 3. EVENT LISTENERS (BUTTON CLICKS)
// ==========================================
window.onload = function() {
    
    const memberCountInput = document.getElementById('member-count');
    if (memberCountInput) {
        memberCountInput.addEventListener('input', function(e) {
            window.generateMemberInputs(e.target.value);
        });
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.setAttribute('type', 'button'); 
        analyzeBtn.addEventListener('click', async function(e) {
            e.preventDefault(); 

            const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
            const fileInput = document.getElementById('file-upload');
            const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
            
            // Get Member Names
            const memberInputs = document.querySelectorAll('.member-name');
            const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

            if (!projectText.trim() && !file) {
                alert("Please enter project text OR upload a PDF file first!");
                return;
            }

            window.setButtonState('analyze-btn', true, 'Processing AI...');

            try {
                const formData = new FormData();
                if (file) formData.append('file', file);
                if (projectText.trim()) formData.append('text', projectText);
                formData.append('members', JSON.stringify(membersList));

                const response = await fetch('https://inboxintel-automator.onrender.com/api/analyze-skills', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    alert("Backend Error! Status: " + response.status);
                    throw new Error("Server Error");
                }

                const data = await response.json();
                
                if (data.skills && data.skills.length > 0) {
                    window.renderSkillMapping(data.skills, membersList);
                } else {
                    alert("Python server chal gaya, lekin usne 'skills' khali bheji hain!");
                }

            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                window.setButtonState('analyze-btn', false, 'Analyze Required Expertise');
            }
        });
    }

    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.setAttribute('type', 'button');
        confirmBtn.addEventListener('click', async function(e) {
            e.preventDefault(); 
            const userDeadline = prompt("Enter Deadline for all tasks:", "2 Days");
            window.globalDeadline = userDeadline || "2 Days"; 
            
            window.setButtonState('confirm-btn', true, 'Assigning Tasks...');
            
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
                    window.renderTasks(data.tasks);
                } else {
                    alert("Python server ne tasks khali bheje hain!");
                }
            } catch (error) {
                console.error("Assign Error:", error);
            } finally {
                window.setButtonState('confirm-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
};