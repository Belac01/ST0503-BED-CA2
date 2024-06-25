// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/taskModel.js");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE TASK
// ##############################################################
module.exports.createNewTask = (req, res, next) => {
    // Checks if the request body contains a title, description, and points and if any of these properties are missing
    if(!req.body.title || !req.body.description || !req.body.points)
    {
        // Returns status 400 if title/description/points are undefined as mentioned in the brief
        res.status(400).send("Error: title or description or points is undefined");
        return;
    }

    // Creates a data object containing the title, description, and points extracted from the request body
    const data = {
        title: req.body.title,
        description: req.body.description,
        points: req.body.points

    }

    //  Callback function that will be invoked after attempting to insert a new task into the database
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewTask:", error);
            res.status(500).json(error);
        } else {
            // Response object containing the task ID, title, description, and points
            const response = {
                task_id: results.insertId,
                title: data.title,
                description: data.description,
                points: data.points
            };
            // Returns 201 and the expected response as mentioned
            res.status(201).json(response);
        }
    }

    model.insertSingle(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ ALL TASKS
// ##############################################################
module.exports.readAllTasks = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllTasks:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ TASK BY ID
// ##############################################################
module.exports.readTaskById = (req, res, next) => {
    // Extracts the task ID from the request parameters and stores it in a data object.
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
                // user_id does not exist and will return 404 status as mentioned
                res.status(404).json({
                    message: "Task not found"
                });
            }
            // user_id was found and it responds with a 200 OK status as mentioned
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE TASK BY ID
// ##############################################################
module.exports.updateTaskById = (req, res, next) => {
    // Checks if the request body contains a title, description, and points.
    if(!req.body.title || !req.body.description || !req.body.points)
    {
        // Request body is missing title or description or points returns a 400 bad request
        res.status(400).json({
            message: "Error: title or description or points is undefined"
        });
        return;
    }

    // Creates a data object containing the task ID extracted from the request parameters and the updated title, description, and points from the request body.
    const data = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        points: req.body.points
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateTaskById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                // If task_id does not exist, return 404 not found
                res.status(404).json({
                    message: "Task not found"
                });
            }
            else {
                // Return the updated user information as the expected response
                res.status(200).json({
                    task_id: data.id,
                    title: data.title,
                    description: data.description,
                    points: data.points
                });
            }
        }
    }

    model.updateById(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE TASK BY ID
// ##############################################################
module.exports.deleteTaskById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteTaskById:", error);
            res.status(500).json(error);
        } else {
            // Checks the affectedRows property in the results to determine if any task records were affected by the deletion
            if(results.affectedRows == 0) 
            {
                // Task_id not found so it responds with a 404 Not Found status as needed
                res.status(404).json({
                    message: "Task not found"
                });
            }
            //  A successful deletation with no errors returns 204 status code without any response as mentioned
            else res.status(204).send(); // 204 No Content            
        }
    }

    model.deleteById(data, callback);
}