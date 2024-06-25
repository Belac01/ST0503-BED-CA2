document.addEventListener("DOMContentLoaded", function () {
  const url = new URL(document.URL);
  const urlParams = url.searchParams;
  const guildId = urlParams.get("guild_id"); // Get the guild ID from the URL
  const getToken = localStorage.getItem("token");

  const callbackForGuildInfo = (responseStatus, responseData) => {
      console.log("responseStatus:", responseStatus);
      console.log("responseData:", responseData);

      const guildInfo = document.getElementById("guildInfo");

      if (responseStatus == 404) {
          guildInfo.innerHTML = `${responseData.message}`;
          return;
      } else {
          guildInfo.innerHTML = `
              <div class="card">
                  <div class="card-body">
                      <h5 class="card-title">${responseData.guild_name}</h5>
                      <p class="card-text">
                          Description: ${responseData.description} <br>
                          Creation Date: ${responseData.creation_date} <br>
                          Leader ID: ${responseData.leader_id} <br>
                          Leader Username: ${responseData.leader_username} <br>
                      </p>
                      <h6 class="card-subtitle mb-2 text-muted">Members:</h6>
                      <ul>
                          ${responseData.members.map(member => `<li>${member.username} (Role: ${member.role})</li>`).join('')}
                      </ul>
                  </div>
              </div>
          `;
      }
  };

  fetchMethod(currentUrl + `/api/guilds/${guildId}`, callbackForGuildInfo, "GET", null, token = getToken);
});
