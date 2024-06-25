// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR MESSAGE
// ##############################################################
module.exports.selectAll = (callback) =>
{
    const SQLSTATEMENT = `
    SELECT Messages.*, User.username FROM Messages
    JOIN User ON Messages.user_id = User.user_id;
    `;

    pool.query(SQLSTATEMENT, callback);
}


// ##############################################################
// DEFINE SELECT BY ID OPERATIONS FOR MESSAGE
// ##############################################################
module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Messages
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE INSERT OPERATION FOR MESSAGE
// ##############################################################
module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO Messages (message_text, user_id)
    VALUES (?, ?);
    `;
    const VALUES = [data.message_text, data.user_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR MESSAGE BY ID
// ##############################################################
module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE Messages 
    SET message_text = ?, user_id = ?
    WHERE id = ?;
    `;
    const VALUES = [data.message_text, data.user_id, data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE DELETE OPERATIONS FOR MESSAGES BY ID
// ##############################################################
module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM Messages 
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}