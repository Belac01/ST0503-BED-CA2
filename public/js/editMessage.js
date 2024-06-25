function updateMessage(messageId, newMessageText, originalUserId) {
    const getToken = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId"); // Get user_id from local storage
    const callbackForUpdate = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        
        // If the update was successful, refresh the page
        if (responseStatus === 200) {
            location.reload();
        }
    };
    
    // Check if the current user is the same as the original user who posted the message
    if (currentUserId === originalUserId.toString()) {
        const data = {
            user_id: currentUserId, // Use the user_id from local storage
            message_text: newMessageText
        };
        fetchMethod(currentUrl + '/api/message/' + messageId, callbackForUpdate, "PUT", data, token = getToken);
    } else {
        console.log("Error: You can only edit your own messages.");
        // Display the error message in an alert box
        alert("Error: You can only edit your own messages.");
    }
}