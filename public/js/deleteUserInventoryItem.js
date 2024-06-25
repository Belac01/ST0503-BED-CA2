function deleteInventoryItem(inventoryId) {
    const getToken = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId"); // Get user_id from local storage
  
    const callbackForDelete = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
  
        // If the delete was successful, refresh the page
        if (responseStatus === 204) { // No Content
            location.reload();
        } else {
            console.log("Error: Unable to delete the inventory item.");
            alert("Error: Unable to delete the inventory item.");
        }
    };
  
    fetchMethod(currentUrl + `/api/users/${currentUserId}/inventory/${inventoryId}`, callbackForDelete, "DELETE", null, token = getToken);
  }