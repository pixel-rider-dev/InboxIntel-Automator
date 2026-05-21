// Backend API call logic
async function processWorkflowUpdate(formData) {
    try {
        // Ensure this port matches your Flask backend port (default 5000)
        const response = await fetch('https://inboxintel-automator.onrender.com/api/process-update', {
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        alert("Failed to connect to the backend server.");
        return null;
    }
}