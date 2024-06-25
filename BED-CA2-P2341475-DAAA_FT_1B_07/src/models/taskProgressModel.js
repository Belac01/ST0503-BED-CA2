// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE INSERT OPERATION FOR TASK PROGRESS
// ##############################################################
module.exports.insertSingle = (data, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO TaskProgress (user_id, task_id, completion_date, notes)
        VALUES (?, ?, ?, ?);
    `;
    const VALUES = [data.user_id, data.task_id, data.completion_date, data.notes];

    pool.query(SQL_STATEMENT, VALUES, (error, results, fields) => {
        if (error) {
            // If there is an error during the insertion, it logs the error, calls the provided callback function with the error, and provides null as the results
            console.error("Error insertSingle:", error);
            callback(error, null);
        } else {
            // Update user's wallet balance
            module.exports.updateUserWallet(data.user_id, data.task_id, (walletError) => {
                if (walletError) {
                    // If there is an error, it calls the original callback function with the wallet error and provides null as the results
                    callback(walletError, null);
                } else {
                    callback(null, results); // Pass the results to the callback function
                }
            });
        }
    });
};

module.exports.checkEntitiesExistence = (userId, taskId, callback) => {
    // SQL queries to check the existence of a user and a task
    const userSQL = `SELECT COUNT(*) AS userCount 
    FROM User 
    WHERE user_id = ?
    `;
    const taskSQL = `SELECT COUNT(*) AS taskCount 
    FROM Task 
    WHERE task_id = ?
    `;

    // Values to be used in parameterized queries
    const userValues = [userId];
    const taskValues = [taskId];

    pool.query(userSQL, userValues, (userError, userResults) => {
        if (userError) {
            console.error("Error checking user existence:", userError);
            // Indicate an error by passing false for both user and task existence
            // User do not exist so false so do default task as false
            callback(false, false);
        } else {
            // Check if the user exists
            // If the count is greater than 0, it sets userExists to true, indicating that the user exists; otherwise, it sets userExists to false, indicating that the user does not exist
            const userExists = userResults[0].userCount > 0; 

            // After checking user existence, it executes the task query using the same idea
            pool.query(taskSQL, taskValues, (taskError, taskResults) => {
                if (taskError) {
                    console.error("Error checking task existence:", taskError);
                    // Indicate an error by passing false for both user and task existence
                    callback(false, false);
                } else {
                    const taskExists = taskResults[0].taskCount > 0;
                    callback(userExists, taskExists); // Pass the results to the callback function
                }
            });
        }
    });
};

module.exports.updateUserWallet = (user_id, task_id, callback) => {
    const SQL_STATEMENT = `
        UPDATE UserWallet
        SET balance = balance + (SELECT points FROM Task WHERE task_id = ?)
        WHERE user_id = ?;
    `;
    const VALUES = [task_id, user_id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};
// ##############################################################
// DEFINE SELECT BY PROGRESS ID OPERATIONS FOR TASK PROGRESS
// ##############################################################
module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM taskProgress
    WHERE progress_id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR TASK PROGRESS
// ##############################################################
module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE taskProgress 
    SET notes = ?
    WHERE progress_id = ?;
    `;
const VALUES = [data.notes, data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE DELETE OPERATIONS FOR TASK PROGRESS
// ##############################################################
module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM taskProgress 
    WHERE progress_id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE SELECT BY USER ID OPERATIONS FOR TASK PROGRESS
// ##############################################################
module.exports.selectByUserId = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT TaskProgress.*, Task.title as task_title
    FROM TaskProgress
    INNER JOIN Task ON TaskProgress.task_id = Task.task_id
    WHERE TaskProgress.user_id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};