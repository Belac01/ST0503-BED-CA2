document.addEventListener("DOMContentLoaded", function () {
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const messageList = document.getElementById("messageList");
    const currentUserId = Number(localStorage.getItem("userId"));

    responseData.forEach((message) => {
      const displayItem = document.createElement("div");
      const isCurrentUser = message.user_id === currentUserId;
      const displayButtons = isCurrentUser ? '' : 'd-none';
    
      // Convert timestamps to Date objects
      const createdAt = new Date(message.created_at);
      const updatedAt = new Date(message.updated_at);
    
      // Format timestamps
      const createdAtString = createdAt.toLocaleString();
      const updatedAtString = updatedAt.toLocaleString();
    
      // Check if message has been updated
      const isUpdated = createdAt.getTime() !== updatedAt.getTime();
      const updatedAtDisplay = isUpdated ? `<p class="card-text">Updated at: ${updatedAtString}</p>` : '';
    
      displayItem.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Username: ${message.username}</h5>
                <p class="card-text" id="messageText${message.id}">
                    Message: ${message.message_text}
                </p>
                <p class="card-text">
                    Created at: ${createdAtString}
                </p>
                ${updatedAtDisplay}
                <input type="text" id="editInput${message.id}" value="${message.message_text}" class="form-control d-none" />
                <button id="editButton${message.id}" class="btn btn-primary ${displayButtons}">Edit</button>
                <button id="deleteButton${message.id}" class="btn btn-danger ${displayButtons}">Delete</button>
            </div>
        </div>
      `;
      messageList.appendChild(displayItem);

      if (isCurrentUser) {
        document.getElementById(`editButton${message.id}`).addEventListener('click', function() {
            const messageText = document.getElementById(`messageText${message.id}`);
            const editInput = document.getElementById(`editInput${message.id}`);
            const editButton = document.getElementById(`editButton${message.id}`);
            
            if (editButton.textContent === 'Edit') {
                messageText.classList.add('d-none');
                editInput.classList.remove('d-none');
                editButton.textContent = 'Save';
            } else {
                messageText.classList.remove('d-none');
                editInput.classList.add('d-none');
                editButton.textContent = 'Edit';

                // Send a request to the server to update the message
                updateMessage(message.id, editInput.value, message.user_id);
            }
        });
        document.getElementById(`deleteButton${message.id}`).addEventListener('click', function() {
          // Send a request to the server to delete the message
          deleteMessage(message.id, message.user_id);
        });
      }
    });
  };

  fetchMethod(currentUrl + "/api/message", callback);
});