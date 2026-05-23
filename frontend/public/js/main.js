// ==========================================
// 1. TEAM NUMBERS (GLOBAL)
// ==========================================
window.teamNumbers = {
    "usman": "923185640987",
    "ali": "923111111111",
    "mohiz": "923498913992", 
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
// 2. UI FUNCTIONS (GLOBAL WITH UNHIDE MAGIC)
// ==========================================
window.generateMemberInputs = function(count) {
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
};

window.renderSkillMapping = function(skills, membersList) {
    const container = document.getElementById('skills-container');
    if (!container) { 
        alert("System Error: 'skills-container' wala box HTML mein nahi mil raha!"); 
        return; 
    }

    container.classList.remove('hidden');
    container.style.display = 'block';
    
    const skillsSection = document.getElementById('skills-section') || container.closest('section');
    if (skillsSection) {
        skillsSection.classList.remove('hidden');
        skillsSection.style.display = 'block';
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

    container.classList.remove('hidden');
    container.style.display = 'block';
    
    const tasksSection = document.getElementById('tasks-section') || container.closest('section');
    if (tasksSection) {
        tasksSection.classList.remove('hidden');
        tasksSection.style.display = 'block';
    }

    container.innerHTML = ''; 
    
    tasks.forEach(task => {
        // YAHAN HAI MAGIC: Hum AI wali task.deadline ko ignore kar ke globalDeadline use kar rahe hain
        const finalDeadline = window.globalDeadline || "No Deadline";

        const card = document.createElement('div');
        card.className = 'bg-white p-5 rounded border border-gray-200 shadow-sm border-l-4 border-l-[#c48f56] flex flex-col justify-between h-full mb-3';
        card.innerHTML = `
            <div>
                <h3 class="font-bold text-[#2c3e2e] mb-2">${task.task_name || 'Unnamed Task'}</h3>
                <p class="text-sm text-gray-600 mb-1"><strong>Assignee:</strong> <span class="font-bold text-[#c48f56]">${task.assignee || 'Unassigned'}</span></p>
                <p class="text-sm text-gray-600 mb-4"><strong>Deadline:</strong> <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">${finalDeadline}</span></p>
            </div>
            <button onclick="window.sendWhatsAppTask('${task.assignee}', '${task.task_name}', '${finalDeadline}')" class="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-2 px-4 rounded">
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
// 3. EVENT LISTENERS
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
                    throw new Error("Server Error");
                }

                const data = await response.json();
                
                if (data.skills && data.skills.length > 0) {
                    // Yahan hum combined_text ko save kar rahe hain taa ke step 2 mein use ho sakay
                    window.fullProjectText = data.combined_text || projectText; 
                    window.renderSkillMapping(data.skills, membersList);
                } else {
                    alert("AI ne skills khali bheji hain!");
                }

            } catch (error) {
                console.error("Fetch Error:", error);
                alert("Backend se connect karne mein masla aa raha hai.");
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
                // 1. Dropdowns se data ikhata karna (Expertise Mapping)
                const expertiseMapping = {};
                const skillRows = document.querySelectorAll('#skills-container > div');
                skillRows.forEach(row => {
                    const skillName = row.querySelector('.skill-name').textContent;
                    const expertSelected = row.querySelector('.expert-select').value;
                    if (expertSelected) {
                        expertiseMapping[skillName] = expertSelected;
                    }
                });

                // 2. Sirf wohi data bhejna jo backend /process-update ko chahiye
                const formData = new FormData();
                const projectText = window.fullProjectText || (document.getElementById('project-text') ? document.getElementById('project-text').value : '');
                
                formData.append('text', projectText);
                formData.append('expertise_mapping', JSON.stringify(expertiseMapping));

                // 3. API ka sahi rasta: /process-update
                const response = await fetch('https://inboxintel-automator.onrender.com/api/process-update', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.tasks) {
                    window.renderTasks(data.tasks);
                } else if (data.message) {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Assign Error:", error);
            } finally {
                window.setButtonState('confirm-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
};