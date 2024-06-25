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
            alert('You are not logged in. Please log in to view and to be able to create your task progress.');
        } else {
            const taskProgressList = document.getElementById("taskProgressList");
            responseData.forEach((task_progress) => {
                const date = new Date(task_progress.completion_date);
                const formattedDate = date.toISOString().split('T')[0];
  
                const displayItem = document.createElement("div");
                displayItem.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
                displayItem.innerHTML = `
                    <div class="card">
                        <img src="images/tasks/${task_progress.task_id}.png" class="card-img-top" alt="Task Image">
                        <div class="card-body">
                            <h5 class="card-title">${task_progress.task_title}</h5>
                            <p class="card-text">
                                Task ID: ${task_progress.task_id} <br>
                                Completion Date: ${formattedDate} <br>
                                Notes: ${task_progress.notes} <br>
                            </p>
                        </div>
                    </div>
                `;
                taskProgressList.appendChild(displayItem);
            });
        }
    };
  
    fetchMethod(currentUrl + `/api/task_progress/users/${getUserId}`, callback, "GET", null, token = getToken);
  });
  