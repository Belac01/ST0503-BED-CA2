document.addEventListener("DOMContentLoaded", function () {

    const getUserId = localStorage.getItem("userId");
    const getToken = localStorage.getItem("token");

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 201) {
            // Message was successfully created
            console.log("Message created:", responseData);
            location.reload();
        } else {
            // Handle other errors
            console.error("Error creating message:", responseData);
        }
    };

    const messageForm = document.getElementById("messageForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");

    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const msg = document.getElementById("msg").value;

        // Check if userId exists
        if (!getUserId) {
            warningText.textContent = "Please log in to post your message.";
            warningCard.classList.remove("d-none");  // Show the warning card
            return;  // Exit the function
        }

        const data = {
            user_id: getUserId,
            message_text: msg
        };

        // Perform request to create new message
        fetchMethod(currentUrl + "/api/message", callback, "POST", data, token = getToken);

        // Reset the form fields
        messageForm.reset();
    });
});
