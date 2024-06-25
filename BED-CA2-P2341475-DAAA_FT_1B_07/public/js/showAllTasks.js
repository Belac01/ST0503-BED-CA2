document.addEventListener("DOMContentLoaded", function () {
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const taskList = document.getElementById("taskList");
    responseData.forEach((task) => {
      const displayItem = document.createElement("div");
      displayItem.className =
        "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
      displayItem.innerHTML = `
        <div class="card">
            <img src="images/tasks/${task.task_id}.png" class="card-img-top" alt="Task Image">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">
                    Task ID: ${task.task_id} <br>
                    Description: ${task.description} <br>
                    Points: ${task.points} <br>
                </p>
            </div>
        </div>
        `;
      taskList.appendChild(displayItem);
    });
  };

  fetchMethod(currentUrl + "/api/tasks", callback);
});