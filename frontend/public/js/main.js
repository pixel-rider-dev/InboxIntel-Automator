document.addEventListener('DOMContentLoaded', () => {
    
    const memberCountInput = document.getElementById('member-count');
    if (memberCountInput) {
        memberCountInput.addEventListener('input', function(e) {
            if (window.generateMemberInputs) window.generateMemberInputs(e.target.value);
        });
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        // YAHAN 'e' ADD KIYA HAI
        analyzeBtn.addEventListener('click', async function(e) {
            e.preventDefault(); // PAGE REFRESH ROKNE KI LINE (SAB SE ZAROORI)

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
                const formData = new FormData();
                if (file) formData.append('file', file);
                if (projectText.trim()) formData.append('text', projectText);
                formData.append('members', JSON.stringify(membersList));

                const response = await fetch('https://inboxintel-automator.onrender.com/api/analyze-skills', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const err = await response.text();
                    throw new Error(`Server Error: ${err}`);
                }

                const data = await response.json();
                if (window.renderSkillMapping) window.renderSkillMapping(data.skills || [], membersList);
                if (data.tasks && window.renderTasks) window.renderTasks(data.tasks);

            } catch (error) {
                console.error("Error:", error);
                alert("Backend Processing Error ya Server Sleep mode mein hai. Inspect > Console check karein.");
            } finally {
                if (window.setButtonState) window.setButtonState('analyze-btn', false, 'Analyze Required Expertise');
            }
        });
    }

    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function(e) {
            e.preventDefault(); // YAHAN BHI PAGE REFRESH ROK DIYA HAI

            const userDeadline = prompt("Enter Deadline for all tasks:", "2 Days");
            if (userDeadline) window.globalDeadline = userDeadline; 
            
            if (window.setButtonState) window.setButtonState('confirm-btn', true, 'Confirm & Assign Tasks');
            
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

                if (response.ok) {
                    const data = await response.json();
                    if (data.tasks && window.renderTasks) window.renderTasks(data.tasks);
                } else {
                    alert("Assign Error: Check python endpoint name.");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                if (window.setButtonState) window.setButtonState('confirm-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
});