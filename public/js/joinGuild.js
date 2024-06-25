function joinGuild(guildId) {
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

    const callbackForJoinGuild = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
    
        const warningCard = document.getElementById("warningCard"); // Get the warning card element
        const warningText = document.getElementById("warningText"); // Get the warning text element
    
        if (responseStatus == 404) {
            warningText.textContent = `${responseData.message}`;
            warningCard.classList.remove("d-none"); // Show the warning card
            warningCard.classList.remove("border-success"); // Remove green border
            warningCard.classList.add("border-danger"); // Add red border
            warningText.classList.remove("text-success"); // Remove green text
            warningText.classList.add("text-danger"); // Add red text
            return;
        } else if (responseStatus == 409) {
            warningText.textContent = "You are already in a guild.";
            warningCard.classList.remove("d-none"); // Show the warning card
            warningCard.classList.remove("border-success"); // Remove green border
            warningCard.classList.add("border-danger"); // Add red border
            warningText.classList.remove("text-success"); // Remove green text
            warningText.classList.add("text-danger"); // Add red text
            return;
        } else if (responseStatus == 201) {
            warningText.textContent = `Successfully joined the guild! Guild Name: ${responseData.guild_name}, Your Role: ${responseData.role}`;
            warningCard.classList.remove("d-none"); // Show the warning card
            warningCard.classList.remove("border-danger"); // Remove red border
            warningCard.classList.add("border-success"); // Add green border
            warningText.classList.remove("text-danger"); // Remove red text
            warningText.classList.add("text-success"); // Add green text
        } else {
            console.error("Error joining guild:", responseData);
            warningText.textContent = "Error joining guild: " + responseData;
            warningCard.classList.remove("d-none"); // Show the warning card
            warningCard.classList.remove("border-success"); // Remove green border
            warningCard.classList.add("border-danger"); // Add red border
            warningText.classList.remove("text-success"); // Remove green text
            warningText.classList.add("text-danger"); // Add red text
        }
    };
    
    
    
    

    fetchMethod(currentUrl + `/api/guilds/join/${guildId}/${userId}`, callbackForJoinGuild, "POST", null, token = getToken);
}

