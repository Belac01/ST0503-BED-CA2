document.addEventListener("DOMContentLoaded", function () {
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const guildList = document.getElementById("guildList");
    responseData.forEach((guild) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-6 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${guild.guild_name}</h5>
                <p class="card-text">
                    Description: ${guild.description} <br>
                    Creation Date: ${guild.creation_date} <br>
                    Leader Username: ${guild.leader_username} <br>
                </p>
                <a href="showSingleGuildInfo.html?guild_id=${guild.guild_id}" class="btn btn-primary">View Details</a>
                <button onclick="joinGuild(${guild.guild_id})" class="btn btn-success">Join Guild</button>
                <button onclick="disbandGuild(${guild.guild_id})" class="btn btn-danger">Disband Guild</button>
            </div>
        </div>
        `;
      guildList.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + "/api/guilds", callback);
});
