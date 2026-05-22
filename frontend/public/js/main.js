document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MEMBER COUNT GENERATOR
    const memberCountInput = document.getElementById('member-count');
    if (memberCountInput) {
        memberCountInput.addEventListener('input', function(e) {
            if (window.generateMemberInputs) window.generateMemberInputs(e.target.value);
        });
    }

    // 2. ANALYZE BUTTON (DUAL LOGIC FOR PDF & TEXT)
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async function() {
            const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
            const fileInput = document.getElementById('file-upload');
            const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
            const memberInputs = document.querySelectorAll('.member-name');
            const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

            if (!projectText.trim() && !file) {
                alert("Please enter project text OR upload a PDF file first!");
                return;
            }

            if (window.setButtonState) window.setButtonState('analyze-btn', true, 'Processing...');

            try {
                let response;
                
                if (file) {
                    // PDF UPLOAD METHOD (FormData)
                    const formData = new FormData();
                    formData.append('file', file);
                    if (projectText.trim()) formData.append('text', projectText);
                    formData.append('members', JSON.stringify(membersList));

                    response = await fetch('https://inboxintel-automator.onrender.com/analyze', {
                        method: 'POST',
                        body: formData
                    });
                } else {
                    // TEXT ONLY METHOD (JSON) - Yeh 100% chalega
                    response = await fetch('https://inboxintel-automator.onrender.com/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: projectText, members: membersList })
                    });
                }

                // Agar FastAPI error de, toh exact error screen par dikhao
                if (!response.ok) {
                    const errText = await response.text();
                    alert("FastAPI Error (" + response.status + "):\n" + errText + "\n\n(Backend server ko file format samajh nahi aa raha)");
                    throw new Error("Backend Format Error");
                }

                const data = await response.json();
                if (window.renderSkillMapping) window.renderSkillMapping(data.skills || [], membersList);
                if (data.tasks && window.renderTasks) window.renderTasks(data.tasks);

            } catch (error) {
                console.error("Error:", error);
                if (error.message !== "Backend Format Error") {
                    alert("Render server sleep mode mein hai. 1 minute wait kar ke wapis click karein.");
                }
            } finally {
                if (window.setButtonState) window.setButtonState('analyze-btn', false, 'Analyze Required Expertise');
            }
        });
    }

    // 3. CONFIRM & ASSIGN TASKS BUTTON
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function() {
            const userDeadline = prompt("Enter Deadline for all tasks:", "2 Days");
            if (userDeadline) window.globalDeadline = userDeadline; 
            
            if (window.setButtonState) window.setButtonState('confirm-btn', true, 'Confirm & Assign Tasks');
            
            try {
                const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
                const fileInput = document.getElementById('file-upload');
                const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
                const memberInputs = document.querySelectorAll('.member-name');
                const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

                let response;
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    if (projectText.trim()) formData.append('text', projectText);
                    formData.append('members', JSON.stringify(membersList));

                    response = await fetch('https://inboxintel-automator.onrender.com/assign', {
                        method: 'POST',
                        body: formData
                    });
                } else {
                    response = await fetch('https://inboxintel-automator.onrender.com/assign', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: projectText, members: membersList })
                    });
                }

                if (response.ok) {
                    const data = await response.json();
                    if (data.tasks && window.renderTasks) window.renderTasks(data.tasks);
                } else {
                    const err = await response.text();
                    alert("Assign Error: " + err);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                if (window.setButtonState) window.setButtonState('confirm-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
});