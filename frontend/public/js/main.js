document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MEMBER COUNT BOXES GENERATOR
    const memberCountInput = document.getElementById('member-count');
    if (memberCountInput) {
        memberCountInput.addEventListener('input', function(e) {
            if (window.generateMemberInputs) {
                window.generateMemberInputs(e.target.value);
            }
        });
    }

    // 2. ANALYZE REQUIRED EXPERTISE BUTTON (PDF SUPPORTED)
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async function() {
            const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
            
            // YAHAN FILE UPLOAD KO BHI PAKRA HAI
            const fileInput = document.getElementById('file-upload');
            const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
            
            const memberInputs = document.querySelectorAll('.member-name');
            const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

            // Agar text box bhi khali hai aur PDF bhi nahi di, tab error do
            if (!projectText.trim() && !file) {
                alert("Please enter project text OR upload a PDF file first!");
                return;
            }

            if (window.setButtonState) {
                window.setButtonState('analyze-btn', true, 'Analyze Required Expertise');
            }

            try {
                // PDF aur Text dono ko backend par bhejne ke liye FormData
                const formData = new FormData();
                if (projectText.trim()) formData.append('text', projectText);
                if (file) formData.append('file', file);
                formData.append('members', JSON.stringify(membersList));

                const response = await fetch('https://inboxintel-automator.onrender.com/analyze', {
                    method: 'POST',
                    body: formData // Backend ko file easily mil jayegi
                });

                const data = await response.json();
                
                if (window.renderSkillMapping) {
                    window.renderSkillMapping(data.skills || [], membersList);
                }
                
                if (data.tasks && window.renderTasks) {
                    window.renderTasks(data.tasks);
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Backend process kar raha hai. Render server sleep mode mein ho sakta hai, 1 minute wait karein.");
            } finally {
                if (window.setButtonState) {
                    window.setButtonState('analyze-btn', false, 'Analyze Required Expertise');
                }
            }
        });
    }

    // 3. CONFIRM & ASSIGN TASKS BUTTON (PDF SUPPORTED)
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function() {
            
            const userDeadline = prompt("Enter Deadline for all tasks (e.g., 28 May 2026):", "2 Days");
            if (userDeadline) {
                window.globalDeadline = userDeadline; 
            }

            if (window.setButtonState) window.setButtonState('confirm-btn', true, 'Confirm & Assign Tasks');
            
            try {
                const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
                const fileInput = document.getElementById('file-upload');
                const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
                const memberInputs = document.querySelectorAll('.member-name');
                const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

                const formData = new FormData();
                if (projectText.trim()) formData.append('text', projectText);
                if (file) formData.append('file', file);
                formData.append('members', JSON.stringify(membersList));

                const response = await fetch('https://inboxintel-automator.onrender.com/assign', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.tasks && window.renderTasks) {
                    window.renderTasks(data.tasks);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                if (window.setButtonState) window.setButtonState('confirm-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
});