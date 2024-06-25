document.addEventListener("DOMContentLoaded", function () {

    const getToken = localStorage.getItem("token");
    const getUserId = localStorage.getItem("userId");

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 201) {
            // Task progress was successfully created
            console.log("Task progress created:", responseData);
            window.location.href = "successCreateTaskProgress.html";
        } else if (responseStatus == 404) {
            // Handle specific error for invalid task_id
            warningText.textContent = "The task ID is invalid.";
            warningCard.classList.remove("d-none");  // Show the warning card
        } else {
            // Handle other errors
            console.error("Error creating task progress:", responseData);
        }
    };

    const createTaskProgressForm = document.getElementById("createTaskProgressForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");

    createTaskProgressForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const taskId = document.getElementById("taskId").value;
        const completionDate = document.getElementById("completionDate").value;
        const notes = document.getElementById("notes").value;

        // Check if token exists
        if (!getToken) {
            warningText.textContent = "Please log in.";
            warningCard.classList.remove("d-none");  // Show the warning card
            return;  // Exit the function
        }

        const data = {
            user_id: getUserId,  // Use getUserId from local storage
            task_id: taskId,
            completion_date: completionDate,
            notes: notes
        };

        // Perform request to create new task progress
        fetchMethod(currentUrl + "/api/task_progress", callback, "POST", data, token = getToken);

        // Reset the form fields
        createTaskProgressForm.reset();
    });
});
