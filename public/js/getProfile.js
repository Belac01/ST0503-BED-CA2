document.addEventListener("DOMContentLoaded", function () {
  url = new URL(document.URL);
  const urlParams = url.searchParams;
  const userId = urlParams.get("user_id");
  const getToken = localStorage.getItem("token");
  const getUserId = localStorage.getItem("userId");

  const callbackForUserInfo = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const userInfo = document.getElementById("userInfo");

    if (responseStatus == 404) {
      userInfo.innerHTML = `${responseData.message}`;
      return;
    }  else {
        if (Array.isArray(responseData.inventory)) {
          userInfo.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="card-text">
                      User ID: ${responseData.user_id} <br>
                      Username: ${responseData.username} <br>
                      Email: ${responseData.email} <br>
                      Created on: ${responseData.created_on} <br>
                      Total points: ${responseData.total_points} <br>
                      Wallet ID: ${responseData.wallet_id} <br>
                      Eco-coins: ${responseData.balance} <br>
                      Guild Name: ${responseData.guild_name} <br>
                      Inventory as shown below:<br> ${responseData.inventory.map(item => 'Item Name: ' + item.item_name).join('<br>')} <br>
                    </p>
                </div>
            </div>
          `;
        } else {
          userInfo.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="card-text">
                      User ID: ${responseData.user_id} <br>
                      Username: ${responseData.username} <br>
                      Email: ${responseData.email} <br>
                      Created on: ${responseData.created_on} <br>
                      Total points: ${responseData.total_points} <br>
                      Wallet ID: ${responseData.wallet_id} <br>
                      Balance: ${responseData.balance} <br>
                      Guild Name: ${responseData.guild_name} <br>
                      Inventory: ${responseData.inventory} <br>
                    </p>
                </div>
            </div>
            `;
        }
    };
};

  fetchMethod(currentUrl + `/api/users/${getUserId}/profile`, callbackForUserInfo, "GET", null, token = getToken);
});


/* To display the whole inventory with description and acquisition date if I change my mind*/
          // <div class="card">
          //       <div class="card-body">
          //           <p class="card-text">
          //             User ID: ${responseData.user_id} <br>
          //             Username: ${responseData.username} <br>
          //             Email: ${responseData.email} <br>
          //             Created on: ${responseData.created_on} <br>
          //             Total points: ${responseData.total_points} <br>
          //             Wallet ID: ${responseData.wallet_id} <br>
          //             Eco-coins: ${responseData.balance} <br>
          //             Guild Name: ${responseData.guild_name} <br>
          //             Inventory as shown below:<br> ${responseData.inventory.map(item => 'Item Name: ' + item.item_name + ', Description: ' + item.description + ', Acquisition Date: ' + item.acquisition_date).join('<br>')} <br>
          //           </p>
          //       </div>
          //   </div>