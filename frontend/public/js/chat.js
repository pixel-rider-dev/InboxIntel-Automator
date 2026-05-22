document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const BASE_URL = 'http://127.0.0.1:5000/api';

    if (!chatBtn || !chatInput) return;

    function addMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex w-full ${isUser ? 'justify-end' : 'justify-start'}`;
        const bubble = document.createElement('div');
        bubble.className = `max-w-[85%] p-3 text-sm rounded-lg shadow-sm ${isUser ? 'bg-[#c48f56] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`;
        bubble.textContent = text;
        msgDiv.appendChild(bubble);
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight; 
    }

    async function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        addMessage(question, true);
        chatInput.value = '';

        // New logic: Fetch current mapping from dropdowns.
        let currentMapping = "";
        const skillLabels = document.querySelectorAll('.skill-name');
        const expertSelects = document.querySelectorAll('.expert-select');
        
        if (skillLabels && skillLabels.length > 0) {
            let mappingArr = [];
            for (let i = 0; i < skillLabels.length; i++) {
                const roleName = skillLabels[i].textContent;
                const assignedPerson = expertSelects[i].value;
                if (assignedPerson) {
                    mappingArr.push(`- ${roleName} is assigned to ${assignedPerson}`);
                }
            }
            if (mappingArr.length > 0) {
                currentMapping = "\n\nAssigned Roles:\n" + mappingArr.join("\n");
            }
        }

        // Create context by combining text and dropdown mappings.

        const context = (window.globalCombinedText || "") + currentMapping;
        
        if (!context.trim()) {
            addMessage("Please upload a project update first (Analyze Skills) before asking questions.", false);
            return;
        }

        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'flex w-full justify-start text-xs text-gray-400 italic';
        loadingDiv.textContent = 'Typing...';
        chatBody.appendChild(loadingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        const formData = new FormData();
        formData.append('question', question);
        formData.append('context', context);

        try {
            const response = await fetch(`${BASE_URL}/chat`, { method: 'POST', body: formData });
            const result = await response.json();
            
            document.getElementById(loadingId).remove();

            if (result.answer) {
                addMessage(result.answer, false);
            } else {
                addMessage("Sorry, I could not understand the response.", false);
            }
        } catch (error) {
            document.getElementById(loadingId).remove();
            addMessage("Error connecting to chat server.", false);
        }
    }

    chatBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});