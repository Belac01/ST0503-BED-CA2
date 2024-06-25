document.addEventListener("DOMContentLoaded", function () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const userId = urlParams.get("user_id");
    const itemId = urlParams.get("item_id");
    const getToken = localStorage.getItem("token");
    const getUserId = localStorage.getItem("userId");

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {  // Purchase was successfully confirmed
            console.log("Purchase confirmed:", responseData);
            window.location.href = "successBuy.html";  // Redirect to success.html
        } else {
            // Handle error
            console.error("Error confirming purchase:", responseData);
            if (responseStatus == 400 && responseData.message == 'Insufficient balance to buy the item') {
                warningText.textContent = "Insufficient Eco-coins to buy the item.";
                warningCard.classList.remove("d-none");  // Show the warning card
            }
        }
    };

    const purchaseForm = document.getElementById("purchaseForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");

    purchaseForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Check if userId from URL is the same as getUserId from local storage
        if (userId !== getUserId) {
            warningText.textContent = "Please log in.";
            warningCard.classList.remove("d-none");  // Show the warning card
            return;  // Exit the function
        }

        // Check if token exists
        if (!getToken) {
            warningText.textContent = "Please log in.";
            warningCard.classList.remove("d-none");  // Show the warning card
            return;  // Exit the function
        }

        const data = {
            user_id: userId,
            item_id: itemId
        };

        // Perform request to confirm purchase
        fetchMethod(currentUrl + `/api/shop/buy/${userId}/${itemId}`, callback, "POST", data, token = getToken);

        // Reset the form fields
        purchaseForm.reset();
    });
});
