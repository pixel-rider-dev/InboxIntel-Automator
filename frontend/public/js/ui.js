// ==========================================
// WHATSAPP NOTIFICATION FEATURE (FINAL FORMAT)
// ==========================================

// New name : no clash !
const myTeamContacts = {
    "ali": "923091511363",
    "mohiz": "923498913992",
    "usman": "923185640987", 
    "member 4": "923000000000",
    "member 5": "923000000000"
};

window.sendWhatsAppTask = function(assigneeName, taskDetails, taskDeadline) {
    const cleanName = assigneeName.toLowerCase().trim();
    const phoneNumber = myTeamContacts[cleanName]; // Yahan bhi naam update kar diya
    
    if (!phoneNumber) {
        alert(assigneeName + " ka phone number system mein update nahi hai. Pehle code mein number add karein.");
        return;
    }

    const deadline = taskDeadline || window.globalDeadline || "No Deadline";
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    
    const customMessage = `Assalam o Alaikum ${formattedName},\n\nAI Workflow Automation system ne aapko ek naya task assign kiya hai:\n\n*Task:* ${taskDetails}\n\n*Deadline:* ${deadline}`;
    
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
};