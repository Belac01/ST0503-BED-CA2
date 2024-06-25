document.addEventListener("DOMContentLoaded", function () {
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const shopList = document.getElementById("shopList");
    responseData.forEach((shop) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      const userId = localStorage.getItem('userId'); // Get userid from localstorage
      displayItem.innerHTML = `
        <div class="card">
          <img src="images/shop/${shop.item_id}.png" class="card-img-top" alt="Shop Image">
            <div class="card-body">
                <h5 class="card-title">${shop.item_name}</h5>
                <p class="card-text">
                    Item Id: ${shop.item_id} <br>
                    Eco-coins required: ${shop.points_required} <br>
                    Description: ${shop.description} <br>
                </p>
                <a href="buyShopItem.html?user_id=${userId}&item_id=${shop.item_id}" class="btn btn-primary">Buy Item</a> 
            </div>
        </div>
        `;
      shopList.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + "/api/shop", callback);
});