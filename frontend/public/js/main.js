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

    // 2. ANALYZE REQUIRED EXPERTISE BUTTON
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async function() {
            const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
            
            // Gather member names
            const memberInputs = document.querySelectorAll('.member-name');
            const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

            if (!projectText.trim()) {
                alert("Please enter project text first!");
                return;
            }

            if (window.setButtonState) {
                window.setButtonState('analyze-btn', true, 'Analyze Required Expertise');
            }

            try {
                // AAPKA RENDER BACKEND LINK YAHAN LAGA DIYA HAI
                const response = await fetch('https://inboxintel-automator.onrender.com/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        text: projectText,
                        members: membersList 
                    })
                });

                const data = await response.json();
                
                // Show Skills in UI
                if (window.renderSkillMapping) {
                    window.renderSkillMapping(data.skills || [], membersList);
                }
                
                // Show Tasks if backend returns them immediately
                if (data.tasks && window.renderTasks) {
                    window.renderTasks(data.tasks);
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Backend process kar raha hai. Render server sleep mode mein ho sakta hai, bas 1 minute wait kar ke dobara click karein.");
            } finally {
                if (window.setButtonState) {
                    window.setButtonState('analyze-btn', false, 'Analyze Required Expertise');
                }
            }
        });
    }

    // 3. CONFIRM & ASSIGN TASKS BUTTON (With Custom Deadline)
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function() {
            
            // Custom Deadline Prompt
            const userDeadline = prompt("Enter Deadline for all tasks (e.g., 28 May 2026):", "2 Days");
            if (userDeadline) {
                window.globalDeadline = userDeadline; 
            }

            if (window.setButtonState) window.setButtonState('confirm-btn', true, 'Confirm & Assign Tasks');
            
            try {
                const projectText = document.getElementById('project-text') ? document.getElementById('project-text').value : '';
                const memberInputs = document.querySelectorAll('.member-name');
                const membersList = Array.from(memberInputs).map(input => input.value).filter(val => val.trim() !== '');

                const response = await fetch('https://inboxintel-automator.onrender.com/assign', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        text: projectText,
                        members: membersList 
                    })
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