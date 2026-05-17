document.addEventListener('DOMContentLoaded', () => {
    const memberCountInput = document.getElementById('member-count');
    const analyzeBtn = document.getElementById('analyze-btn'); 
    const assignBtn = document.getElementById('assign-tasks-btn'); 
    const BASE_URL = 'http://127.0.0.1:5000/api';
    
    // Naya Change: Is variable ko window mein daal diya taake chat.js isay read kar sakay
    window.globalCombinedText = "";
    let savedMembers = [];

    if (memberCountInput) {
        memberCountInput.addEventListener('input', (e) => {
            const count = parseInt(e.target.value) || 0;
            if (typeof generateMemberInputs === 'function') generateMemberInputs(count);
        });
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const memberInputs = document.querySelectorAll('.member-name');
            savedMembers = Array.from(memberInputs).map(input => input.value.trim()).filter(val => val !== '');
            
            if(savedMembers.length === 0) {
                alert("Please add at least one member name!");
                return;
            }
            setButtonState('analyze-btn', true, 'Analyze Required Expertise');
            const rawText = document.getElementById('raw-text').value;
            const fileInput = document.getElementById('file-upload').files[0];

            const formData = new FormData();
            formData.append('text', rawText);
            if (fileInput) formData.append('file', fileInput);

            try {
                const response = await fetch(`${BASE_URL}/analyze-skills`, { method: 'POST', body: formData });
                const result = await response.json();
                
                if (result.skills) {
                    window.globalCombinedText = result.combined_text; 
                    renderSkillMapping(result.skills, savedMembers);
                    const mapSection = document.getElementById('mapping-section');
                    mapSection.classList.remove('hidden');
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error("Analysis Error:", error);
            } finally {
                setButtonState('analyze-btn', false, 'Analyze Required Expertise');
            }
        });
    }

    if (assignBtn) {
        assignBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            setButtonState('assign-tasks-btn', true, 'Confirm & Assign Tasks');
            const skillLabels = document.querySelectorAll('.skill-name');
            const expertSelects = document.querySelectorAll('.expert-select');
            let mappingList = [];
            let allSelected = true;

            for (let i = 0; i < skillLabels.length; i++) {
                const skillName = skillLabels[i].textContent;
                const selectedMember = expertSelects[i].value;
                if (!selectedMember) allSelected = false;
                mappingList.push(`Role: ${skillName} -> Assigned Expert: ${selectedMember || 'None'}`);
            }

            if (!allSelected) {
                alert("Please assign an expert to ALL required skills!");
                setButtonState('assign-tasks-btn', false, 'Confirm & Assign Tasks');
                return;
            }

            const formData = new FormData();
            formData.append('text', window.globalCombinedText); 
            formData.append('expertise_mapping', mappingList.join(' | ')); 

            try {
                const response = await fetch(`${BASE_URL}/process-update`, { method: 'POST', body: formData });
                const result = await response.json();
                
                if (result.tasks) {
                    renderTasks(result.tasks);
                    const outSection = document.getElementById('output-section');
                    outSection.classList.remove('hidden');
                    outSection.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error("Assignment Error:", error);
            } finally {
                setButtonState('assign-tasks-btn', false, 'Confirm & Assign Tasks');
            }
        });
    }
});