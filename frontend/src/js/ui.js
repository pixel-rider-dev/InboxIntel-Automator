// Function 1: Group Members ke sirf Name boxes
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

// Function 2: AI Skills ko Insaan (Members) se map karne ke dropdowns
function renderSkillMapping(skills, membersList) {
    const container = document.getElementById('skills-container');
    if (!container) return;
    
    container.innerHTML = ''; 

    if (!skills || skills.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No specific technical skills identified. Please check the text.</p>';
        return;
    }

    skills.forEach(skill => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-100';

        const skillLabel = document.createElement('span');
        skillLabel.className = 'font-bold text-[#2c3e2e] skill-name';
        skillLabel.textContent = skill;

        const selectBox = document.createElement('select');
        selectBox.className = 'expert-select w-1/2 p-2 border border-gray-300 rounded outline-none focus:border-[#c48f56] bg-white';
        
        // Default option
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '-- Select Expert --';
        selectBox.appendChild(defaultOpt);

        // Members dropdown options
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

// Function 3: Final Output Cards
function renderTasks(tasks) {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    
    container.innerHTML = ''; 
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No tasks found.</p>';
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'bg-white p-5 rounded border border-gray-200 shadow-sm border-l-4 border-l-[#c48f56]';
        card.innerHTML = `
            <h3 class="font-bold text-[#2c3e2e] mb-2">${task.task_name || 'Unnamed Task'}</h3>
            <p class="text-sm text-gray-600 mb-1"><strong>Assignee:</strong> <span class="font-bold text-[#c48f56]">${task.assignee || 'Unassigned'}</span></p>
            <p class="text-sm text-gray-600"><strong>Deadline:</strong> <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">${task.deadline || 'No Deadline'}</span></p>
        `;
        container.appendChild(card);
    });
}

// Function 4: Button State
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