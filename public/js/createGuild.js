document.addEventListener("DOMContentLoaded", function () {
    const getToken = localStorage.getItem("token");
    const getUserId = localStorage.getItem("userId");

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 201) {
            console.log("Guild created:", responseData);
            window.location.href = "successGuildCreation.html";
        } else if (responseStatus == 404) {
            // Handle specific error for invalid leader_id
            warningText.textContent = "The leader ID is invalid.";
            warningCard.classList.remove("d-none");
        } else if (responseStatus == 409) {
            // Handle specific error for conflicting guild name
            warningText.textContent = "A guild with this name already exists.";
            warningCard.classList.remove("d-none");
        } else if (responseStatus == 403) {
            // Handle specific error for user already having a guild
            warningText.textContent = "You already have a guild.";
            warningCard.classList.remove("d-none");
        } else {
            console.error("Error creating guild:", responseData);
        }
    };

    const createGuildForm = document.getElementById("createGuildForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");

    createGuildForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const guildName = document.getElementById("guildName").value;
        const description = document.getElementById("description").value;

        if (!getToken) {
            warningText.textContent = "Please log in.";
            warningCard.classList.remove("d-none");
            return;
        }

        const data = {
            guild_name: guildName,
            description: description
        };

        // Perform request to create new guild
        fetchMethod(currentUrl + "/api/guilds/create/" + getUserId, callback, "POST", data, token = getToken);

        // Reset the form fields
        createGuildForm.reset();
    });
});
