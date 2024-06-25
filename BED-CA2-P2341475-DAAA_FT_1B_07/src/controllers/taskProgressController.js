// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/taskProgressModel.js");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE TASK PROGRESS
// ##############################################################
module.exports.createNewTaskProgress = (req, res, next) => {
    if (!req.body.user_id || !req.body.task_id || !req.body.completion_date) {
        res.status(400).send("Error: user_id or task_id or completion date is undefined");
        return;
    }

    const data = {
        user_id: req.body.user_id,
        task_id: req.body.task_id,
        completion_date: req.body.completion_date,
        notes: req.body.notes
    };

    model.checkEntitiesExistence(data.user_id, data.task_id, (userExists, taskExists) => {
        if (!userExists || !taskExists) {
            res.status(404).json({ message: "User or task not found" });
        } else {
            const callback = (error, results, fields) => {
                if (error) {
                    console.error("Error createNewTaskProgress:", error);
                    res.status(500).json(error);
                } else {
                    res.status(201).json({
                        progress_id: results.insertId,
                        user_id: data.user_id,
                        task_id: data.task_id,
                        completion_date: data.completion_date,
                        notes: data.notes
                    });
                }
            };

            model.insertSingle(data, callback);
        }
    });
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ TASK PROGRESS BY PROGRESS ID
// ##############################################################
module.exports.readTaskById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readTaskById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                // If task progress is not found return 404 error as mentioned
                res.status(404).json({
                    message: "Task progress not found"
                });
            }
            // If found return status code 200 as needed
            else {let timeddate = results[0].completion_date 
                  noTimeDate = timeddate.slice(0,timeddate.indexOf(" ")) 
                  results[0].completion_date = noTimeDate
                  res.status(200).json((results[0]))}
        }
    }

    model.selectById(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE TASK PROGRESS BY ID
// ##############################################################
module.exports.updateTaskProgressById = (req, res, next) => {
    if (!req.body.notes) {
        // If notes is undefined, then return code 400 as mentioned
        res.status(400).json({
            message: "Error: notes is undefined"
        });
        return;
    }

    // Object containing the task progress id extracted from the request parameters and the updated notes from the request body
    const data = {
        id: req.params.id,
        notes: req.body.notes
    }

    const updateCallback = (error, updateResults, updateFields) => {
        if (error) {
            // Database error
            console.error("Error updateTaskProgressById:", error);
            res.status(500).json(error);
        } else {
            if (updateResults.affectedRows === 0) {
                // No rows were affected means the task progress was not found, so it responds with a 404 error as needed
                res.status(404).json({
                    message: "Task Progress not found"
                });
            } else {
                // Fetch the updated task progress from the database
                const fetchCallback = (fetchError, fetchResults, fetchFields) => {
                    if (fetchError) {
                        console.error("Error fetching updated task progress:", fetchError);
                        res.status(500).json(fetchError);
                    } else {
                        // Return the updated task progress in the response body
                        const responseBody = {
                            progress_id: fetchResults[0].progress_id,
                            user_id: fetchResults[0].user_id,
                            task_id: fetchResults[0].task_id,
                            completion_date: fetchResults[0].completion_date,
                            notes: fetchResults[0].notes
                        };
                        // Returns status code 200 as needed
                        res.status(200).json(responseBody);
                    }
                };

                model.selectById(data, fetchCallback);
            }
        }
    };

    // Perform the update
    model.updateById(data, updateCallback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE TASK PROGRESS BY ID
// ##############################################################
module.exports.deleteTaskProgressById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteTaskProgressById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                // Returns 404 error when the task progress does not exist as mentioned
                res.status(404).json({
                    message: "Task Progress not found"
                });
            }
            // Returns 204 status code with no response code as needed
            else res.status(204).send();            
        }
    }

    model.deleteById(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ TASK PROGRESS BY USER ID
// ##############################################################
module.exports.readTaskByUserId = (req, res, next) => {
    const data = {
        id: req.params.id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readTaskByUserId:", error);
            res.status(500).json(error);
        } else {
            // Returns 200 OK status code with the results as response
            res.status(200).json(results);
        }
    };

    model.selectByUserId(data, callback);
};