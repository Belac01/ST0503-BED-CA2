// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE INSERT OPERATION FOR SHOP
// ##############################################################
module.exports.getItemByName = (itemName, callback) => {
    const SQL_STATEMENT = `
        SELECT * FROM Shop WHERE item_name = ?;
    `;
    const VALUES = [itemName];

    pool.query(SQL_STATEMENT, VALUES, callback);
}

// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR SHOP
// ##############################################################
module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Shop;
    `;

pool.query(SQLSTATMENT, callback);
}

// ##############################################################
// DEFINE SELECT BY ID OPERATIONS FOR SHOP
// ##############################################################
module.exports.selectById = (data, callback) => 
{
    const SQLSTATMENT = `
    SELECT * FROM Shop
    WHERE item_id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR SHOP
// ##############################################################
module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE Shop 
    SET item_name = ?, points_required = ?, description = ?
    WHERE item_id = ?;
    `;
const VALUES = [data.item_name, data.points_required, data.description, data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}
module.exports.checkDuplicateItemName = (itemName, callback) => {
    const SQL_STATEMENT = `
        SELECT item_id
        FROM Shop
        WHERE item_name = ?;
    `;
    const VALUES = [itemName];

    pool.query(SQL_STATEMENT, VALUES, callback);
}

// ##############################################################
// DEFINE DELETE OPERATIONS FOR SHOP
// ##############################################################
module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM Shop 
    WHERE item_id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// ##############################################################
// DEFINE INSERT OPERATIONS FOR SHOP BUY
// ##############################################################
module.exports.selectWalletBalance = (userId, callback) => {
    const SQL_STATEMENT = `
        SELECT wallet_id, balance
        FROM UserWallet
        WHERE user_id = ?;
    `;
    const VALUES = [userId];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.selectShopItem = (itemId, callback) => {
    const SQL_STATEMENT = `
        SELECT item_id, item_name, points_required, description
        FROM Shop
        WHERE item_id = ?;
    `;
    const VALUES = [itemId];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.updateWalletBalance = (userId, newBalance, callback) => {
    const SQL_STATEMENT = `
        UPDATE UserWallet
        SET balance = ?
        WHERE user_id = ?;
    `;
    const VALUES = [newBalance, userId];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.insertIntoUserInventory = (inventoryData, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO UserInventory (user_id, item_id, item_name, description, acquisition_date)
        VALUES (?, ?, ?, ?, NOW());
    `;
    const VALUES = [inventoryData.userId, inventoryData.itemId, inventoryData.itemName, inventoryData.description];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.selectUserById = (userId, callback) => {
    const SQL_STATEMENT = `
        SELECT wallet_id, balance
        FROM UserWallet
        WHERE user_id = ?;
    `;
    const VALUES = [userId];

    pool.query(SQL_STATEMENT, VALUES, callback);
};