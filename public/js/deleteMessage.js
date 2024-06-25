function deleteMessage(messageId, originalUserId) {
    const getToken = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId"); // Get user_id from local storage
    
    const callbackForDelete = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        
        // If the delete was successful, refresh the page
        if (responseStatus === 200) {
            location.reload();
        }
    };
    
    // Check if the current user is the same as the original user who posted the message
    if (currentUserId === originalUserId.toString()) {
        fetchMethod(currentUrl + '/api/message/' + messageId, callbackForDelete, "DELETE", null, token = getToken);
    } else {
        console.log("Error: You can only delete your own messages.");
        // Display the error message in an alert box
        alert("Error: You can only delete your own messages.");
    }
}
