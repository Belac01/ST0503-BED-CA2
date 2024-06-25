document.addEventListener('DOMContentLoaded', (event) => {
    function leaveGuild() {
        const getToken = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Get the user ID from local storage
    
        const warningCard = document.getElementById("warningCard"); // Get the warning card element
        const warningText = document.getElementById("warningText"); // Get the warning text element
    
        // Check if the user is logged in
        if (!getToken || !userId) {
            warningText.textContent = "Please log in.";
            warningCard.classList.remove("d-none"); // Show the warning card
            return; // Exit the function
        }
    
        const callbackForLeaveGuild = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            const warningCard = document.getElementById("warningCard"); // Get the warning card element
            const warningText = document.getElementById("warningText"); // Get the warning text element
        
            if (responseStatus == 500) {
                console.error("Error leaveGuild:", responseData);
                warningText.textContent = "Error leaving guild: " + responseData;
                warningCard.classList.remove("d-none"); // Show the warning card
                warningCard.classList.remove("border-success"); // Remove green border
                warningCard.classList.add("border-danger"); // Add red border
                warningText.classList.remove("text-success"); // Remove green text
                warningText.classList.add("text-danger"); // Add red text
            } else if (responseStatus == 403 || responseStatus == 404) {
                warningText.textContent = `${responseData.message}`;
                warningCard.classList.remove("d-none"); // Show the warning card
                warningCard.classList.remove("border-success"); // Remove green border
                warningCard.classList.add("border-danger"); // Add red border
                warningText.classList.remove("text-success"); // Remove green text
                warningText.classList.add("text-danger"); // Add red text
            } else if (responseStatus == 204) {
                warningText.textContent = "Successfully left the guild!";
                warningCard.classList.remove("d-none"); // Show the warning card
                warningCard.classList.remove("border-danger"); // Remove red border
                warningCard.classList.add("border-success"); // Add green border
                warningText.classList.remove("text-danger"); // Remove red text
                warningText.classList.add("text-success"); // Add green text
            } else {
                console.error("Error leaving guild:", responseData);
                warningText.textContent = "Error leaving guild: " + responseData;
                warningCard.classList.remove("d-none"); // Show the warning card
                warningCard.classList.remove("border-success"); // Remove green border
                warningCard.classList.add("border-danger"); // Add red border
                warningText.classList.remove("text-success"); // Remove green text
                warningText.classList.add("text-danger"); // Add red text
            }
        };
    
        fetchMethod(currentUrl + `/api/guilds/leave/${userId}`, callbackForLeaveGuild, "DELETE", null, token = getToken);
    }
    
    // Get the leave guild button
    const leaveGuildButton = document.getElementById('leaveGuildButton');
    
    // Add a click event listener to the leave guild button
    leaveGuildButton.addEventListener('click', function() {
        // Call the leaveGuild function when the button is clicked
        leaveGuild();
    });
});