document.addEventListener("DOMContentLoaded", function () {
  url = new URL(document.URL);
  const urlParams = url.searchParams;
  const userId = urlParams.get("user_id");
  const getToken = localStorage.getItem("token");
  const getUserId = localStorage.getItem("userId");

  const callback = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);

      if (responseStatus === 401) { // Unauthorized
          alert('You are not logged in. Please log in to view your inventory.');
      } else if (Array.isArray(responseData)) {
          const inventoryList = document.getElementById("inventoryList");
          responseData.forEach((userinventory) => {
              const date = new Date(userinventory.acquisition_date);
              const formattedDate = date.toISOString().split('T')[0];

              const displayItem = document.createElement("div");
              displayItem.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
              displayItem.innerHTML = `
      <div class="card">
        <img src="images/shop/${userinventory.item_id}.png" class="card-img-top" alt="Shop Image">
        <div class="card-body">
          <h5 class="card-title">${userinventory.item_name}</h5>
          <p class="card-text">
            Acquisition Date: ${userinventory.acquisition_date} <br>
            Description: ${userinventory.description} <br>
          </p>
          <button class="btn btn-danger" onclick="deleteInventoryItem(${userinventory.inventory_id})">Delete</button>
        </div>
      </div>
    `;
    inventoryList.appendChild(displayItem);
  });
      } else {
          console.log(responseData.message);
          const messageDiv = document.createElement("div");
          messageDiv.textContent = responseData.message;
          inventoryList.appendChild(messageDiv);
      }
  };

  fetchMethod(currentUrl + `/api/users/${getUserId}/inventory`, callback, "GET", null, token = getToken);
});