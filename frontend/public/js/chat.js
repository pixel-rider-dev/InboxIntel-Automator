document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatBody = document.getElementById('chat-body');

    if (!chatSendBtn || !chatInput || !chatBody) return;

    // Chat box mein message dikhane ka function
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex w-full ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`;
        
        const innerDiv = document.createElement('div');
        // User ka message brown color mein, aur bot ka white mein
        innerDiv.className = sender === 'user' 
            ? 'bg-[#c48f56] text-white p-3 rounded-lg rounded-tr-none max-w-[85%] shadow-sm' 
            : 'bg-white border border-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm';
        
        innerDiv.textContent = text;
        msgDiv.appendChild(innerDiv);
        chatBody.appendChild(msgDiv);
        
        // Auto scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Message send karne ka main function
    async function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        // 1. Screen par user ka sawal dikhao
        addMessage(question, 'user');
        chatInput.value = ''; // Input box khali kar do

        // 2. Loading animation dikhao
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'flex w-full justify-start mb-4';
        loadingDiv.innerHTML = `<div class="bg-white border border-gray-200 text-gray-500 p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm italic">AI is typing...</div>`;
        chatBody.appendChild(loadingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // 3. Backend ko bhejne ke liye data taiyar karo
            const formData = new FormData();
            formData.append('question', question);
            
            // Project ka data main.js se uthao (agar hai), warna textbox se
            const context = window.fullProjectText || (document.getElementById('project-text') ? document.getElementById('project-text').value : '');
            formData.append('context', context);

            // 4. LIVE Render API par request bhejo
            const response = await fetch('https://inboxintel-automator.onrender.com/api/chat', {
                method: 'POST',
                body: formData
            });

            // Loading hata do
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) loadingElement.remove();

            if (!response.ok) {
                throw new Error("Server Error");
            }

            const data = await response.json();
            
            // 5. AI ka jawab screen par dikhao
            if (data.answer) {
                addMessage(data.answer, 'bot');
            } else if (data.error) {
                addMessage("Error: " + data.error, 'bot');
            } else {
                addMessage("Sorry, main samajh nahi paya.", 'bot');
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) loadingElement.remove();
            
            addMessage("Error connecting to live chat server.", 'bot');
        }
    }

    // Button click karne par message bhejo
    chatSendBtn.addEventListener('click', sendMessage);

    // Enter key dabane par bhi message bhejo
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});