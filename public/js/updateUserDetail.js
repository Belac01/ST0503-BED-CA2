document.addEventListener("DOMContentLoaded", function () {
    const updateForm = document.getElementById("updateForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");
  
    updateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const getToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); 
      const newUsername = document.getElementById("newUsername").value;
      const newEmail = document.getElementById("newEmail").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword = document.getElementById("confirmNewPassword").value;
  
      // Perform update logic
      if (newPassword === confirmNewPassword) {
        // Passwords match, proceed with update
        console.log("Update successful");
        console.log("New Username:", newUsername);
        console.log("New Email:", newEmail);
        console.log("New Password:", newPassword);
        warningCard.classList.add("d-none");
  
        const updatedData = {
            userId: userId,
            username: newUsername, // Change this line
            email: newEmail, // Change this line
            password: newPassword,
          };
  
          const callback = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            if (responseStatus == 200) {
              // Check if update was successful
              if (responseData.token) {
                // Update the token in local storage if needed
                localStorage.setItem("token", responseData.token);
              }
              // Redirect to another HTML page
              window.location.href = "successUpdateUserDetail.html";
            } else {
              warningCard.classList.remove("d-none");
              warningText.innerText = responseData.message;
            }
          };
  
        // Perform update request
        fetchMethod(currentUrl + `/api/users/${userId}`, callback, "PUT", updatedData, token = getToken);
  
        // Reset the form fields
        updateForm.reset();
      } else {
        // Passwords do not match, handle error
        warningCard.classList.remove("d-none");
        warningText.innerText = "New passwords do not match";
      }
    });
  });