document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatBody = document.getElementById('chat-body');

    if (!chatSendBtn || !chatInput || !chatBody) return;

    // Function to display messages in the chat box
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex w-full ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`;
        
        const innerDiv = document.createElement('div');
        // User message in brown, bot message in white
        innerDiv.className = sender === 'user' 
            ? 'bg-[#c48f56] text-white p-3 rounded-lg rounded-tr-none max-w-[85%] shadow-sm' 
            : 'bg-white border border-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm';
        
        innerDiv.textContent = text;
        msgDiv.appendChild(innerDiv);
        chatBody.appendChild(msgDiv);
        
        // Auto scroll to the bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Main function to handle sending messages
    async function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        // 1. Display user's question on the screen
        addMessage(question, 'user');
        chatInput.value = ''; // Clear the input box

        // 2. Show loading animation
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'flex w-full justify-start mb-4';
        loadingDiv.innerHTML = `<div class="bg-white border border-gray-200 text-gray-500 p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm italic">AI is typing...</div>`;
        chatBody.appendChild(loadingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // 3. Prepare form data to send to the backend
            const formData = new FormData();
            formData.append('question', question);
            
            // Fetch raw project text
            let context = window.fullProjectText || (document.getElementById('project-text') ? document.getElementById('project-text').value : '');
            
            // 🔥 STRICT BOSS INSTRUCTIONS FOR AI 🔥
            let assignments = "";
            const skillRows = document.querySelectorAll('#skills-container > div');
            if (skillRows.length > 0) {
                assignments = "\n\n========================================\n";
                assignments += "CRITICAL STRICT INSTRUCTIONS FOR AI BOT:\n";
                assignments += "1. IGNORE any placeholders like 'Member 1', 'Member 2', 'Member 3' from the text above.\n";
                assignments += "2. The ACTUAL finalized task assignments are listed below. YOU MUST USE THESE NAMES:\n";
                
                skillRows.forEach(row => {
                    const skillName = row.querySelector('.skill-name').textContent;
                    const expertSelected = row.querySelector('.expert-select').value;
                    if (expertSelected) {
                        assignments += `-> Task: ${skillName} | Assigned to: ${expertSelected}\n`;
                    }
                });
                
                assignments += `\n3. IF the user asks about ANY member NOT listed in the assignments above (for example 'Member 3' or 'Member 4'), you MUST reply exactly: 'Unko koi task assign nahi hua hai.' DO NOT guess or invent tasks for them.\n`;
                assignments += "========================================\n";
            }
            
            // Append final strict context
            formData.append('context', context + assignments);

            // 4. Send request to the LIVE Render API
            const response = await fetch('https://inboxintel-automator.onrender.com/api/chat', {
                method: 'POST',
                body: formData
            });

            // Remove loading animation
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) loadingElement.remove();

            if (!response.ok) {
                throw new Error("Server Error");
            }

            const data = await response.json();
            
            // 5. Display AI's response on the screen
            if (data.answer) {
                addMessage(data.answer, 'bot');
            } else if (data.error) {
                addMessage("Error: " + data.error, 'bot');
            } else {
                addMessage("Sorry, I couldn't understand that.", 'bot');
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) loadingElement.remove();
            
            addMessage("Error connecting to live chat server.", 'bot');
        }
    }

    // Send message on button click
    chatSendBtn.addEventListener('click', sendMessage);

    // Send message on pressing the Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});