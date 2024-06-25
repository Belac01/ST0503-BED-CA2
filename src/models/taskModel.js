// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE INSERT OPERATION FOR TASK
// ##############################################################
module.exports.insertSingle = (data, callback) => {
    // Holds the SQL statement for inserting a new task into the "Task" table and uses parameter placeholders (?) for the values to be inserted
    const SQLSTATMENT = `
    INSERT INTO Task (title, description, points)
    VALUES (?, ?, ?);
    `;
// Array of values that will replace the placeholders in the SQL statement
const VALUES = [data.title, data.description, data.points];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR TASK
// ##############################################################
module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Task;
    `;

pool.query(SQLSTATMENT, callback);
}

// ##############################################################
// DEFINE SELECT BY ID OPERATIONS FOR TASK
// ##############################################################
module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Task
    WHERE task_id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR TASK
// ##############################################################
module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE Task 
    SET title = ?, description = ?, points = ?
    WHERE task_id = ?;
    `;
const VALUES = [data.title, data.description, data.points, data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE DELETE OPERATIONS FOR TASK
// ##############################################################
module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM Task 
    WHERE task_id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}