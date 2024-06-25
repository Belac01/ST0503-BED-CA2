// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/shopModel.js");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE SHOP
// ##############################################################
module.exports.createNewShop = (req, res, next) => {
    // Checks if the request body contains a title, description, and points and if any of these properties are missing
    if (!req.body.item_name || !req.body.points_required || !req.body.description) {
        // Returns status 400 if title/description/points are undefined
        res.status(400).send("Error: Item name or points required or description is undefined");
        return;
    }

    // Creates a data object containing the item name, points required and description extracted from the request body
    const data = {
        item_name: req.body.item_name,
        points_required: req.body.points_required,
        description: req.body.description
    }

    // Check if the item with the same name already exists
    model.getItemByName(data.item_name, (error, results, fields) => {
        if (error) {
            console.error("Error checking duplicate item name:", error);
            // If theres an error, it sends a 500 Internal Server Error response
            res.status(500).json(error);
            return;
        }

        if (results.length > 0) {
            // Item with the same name already exists
            res.status(409).send("Error: Item with the same name already exists");
        } else {
            // Callback function that will be used after attempting to insert a new task into the database
            const callback = (error, results, fields) => {
                if (error) {
                    console.error("Error createNewShop:", error);
                    // If theres an error, it sends a 500 Internal Server Error response
                    res.status(500).json(error);
                } else {
                    // Response object containing the information
                    const response = {
                        shop_id: results.insertId,
                        item_name: req.body.item_name,
                        points_required: req.body.points_required,
                        description: req.body.description
                    };
                    // Returns 201 and the expected response
                    res.status(201).json(response);
                }
            }

            // Insert the item into the database
            model.insertSingle(data, callback);
        }
    });
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ ALL SHOP
// ##############################################################
module.exports.readAllShop = (req, res, next) => 
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllShop:", error);
            // If theres an error, it sends a 500 Internal Server Error response
            res.status(500).json(error);
        }
        // Sends a 200 OK response with the query results
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ SHOP BY ID
// ##############################################################
module.exports.readShopById = (req, res, next) => {
    // Extracts the shop ID from the request parameters and stores it in a data object.
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readShopById:", error);
            // If theres an error, it sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                // item_id does not exist and will return 404 Not Found status
                res.status(404).json({
                    message: "Item not found"
                });
            }
            // item_id was found and it responds with a 200 OK status with the details of the first item in the results array
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE SHOP BY ID
// ##############################################################
module.exports.updateShopById = (req, res, next) => {
    // Checks if the request body contains an item name, points required, and description.
    if (!req.body.item_name || !req.body.points_required || !req.body.description) {
        // Request body is missing anything; return a 400 bad request
        res.status(400).json({
            message: "Error: Item name, points required, or description is undefined"
        });
        return;
    }

    // Creates a data object containing the task ID extracted from the request parameters
    // and the updated item name, points required, and description from the request body.
    const data = {
        id: req.params.id,
        item_name: req.body.item_name,
        points_required: req.body.points_required,
        description: req.body.description
    }

    // Check for duplicate item name before updating
    model.checkDuplicateItemName(data.item_name, (error, results, fields) => {
        if (error) {
            console.error("Error checking duplicate item name:", error);
            // If theres an error, it sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if (results.length > 0) {
                // If duplicate item name exists, return 409 conflict
                res.status(409).json({
                    message: "Item name already exists"
                });
            } else {
                // Proceed with the update
                const callback = (updateError, updateResults, updateFields) => {
                    if (updateError) {
                        console.error("Error updateShopById:", updateError);
                        res.status(500).json(updateError);
                    } else {
                        if (updateResults.affectedRows == 0) {
                            // If item_id does not exist, return 404 not found
                            res.status(404).json({
                                message: "Item not found"
                            });
                        } else {
                            // Return the updated user information as the expected response
                            res.status(200).json({
                                item_id: data.id,
                                item_name: data.item_name,
                                points_required: data.points_required,
                                description: data.description
                            });
                        }
                    }
                }

                // Perform the update
                model.updateById(data, callback);
            }
        }
    });
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE SHOP BY ID
// ##############################################################
module.exports.deleteShopById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteShopById:", error);
            // If theres an error, it sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            // Checks the affectedRows property in the results to determine if any task records were affected by the deletion
            if(results.affectedRows == 0) 
            {
                // item_id not found so it responds with a 404 Not Found status as needed
                res.status(404).json({
                    message: "Item not found"
                });
            }
            //  A successful deletation with no errors returns 204 status code without any response
            else res.status(204).send(); // 204 No Content            
        }
    }

    model.deleteById(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR BUY SHOP ITEM BY ID
// ##############################################################
module.exports.buyItem = (req, res, next) => {
    // Extracts the user ID and item ID from the request parameters and stores them in a userData object
    const userData = {
        userId: req.params.userId,
        itemId: req.params.itemId
    };

    // Check if the user exists
    model.selectUserById(userData.userId, (error, userResults, fields) => {
        if (error) {
            console.error("Error checking user existence:", error);
            // If theres an error, it sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if (userResults.length === 0) {
                // If the user is not found, it sends a 404 Not Found response
                res.status(404).json({
                    message: "No such user"
                });
            } else {
                // User exists, proceed to check item
                model.selectShopItem(userData.itemId, (error, itemResults, fields) => {
                    if (error) {
                        console.error("Error selecting shop item:", error);
                        // If theres an error, it sends a 500 Internal Server Error response
                        res.status(500).json(error);
                    } else {
                        if (itemResults.length === 0) {
                            // // If the item is not found, it sends a 404 Not Found response
                            res.status(404).json({
                                message: "No such item in the shop"
                            });
                        } else {
                            // Item found, check if user has enough balance by extracting the user's current balance and the points required to purchase the item from the results obtained during the user and item checks
                            const userBalance = userResults[0].balance;
                            const itemPointsRequired = itemResults[0].points_required;
                            
                            if (userBalance >= itemPointsRequired) {
                                // Sufficient balance, proceed with the purchase
                                const newBalance = userBalance - itemPointsRequired;
                                model.updateWalletBalance(userData.userId, newBalance, (error, updateResults, fields) => {
                                    if (error) {
                                        console.error("Error updating wallet balance:", error);
                                        // If theres an error, it sends a 500 Internal Server Error response
                                        res.status(500).json(error);
                                    } else {
                                        // Creates an inventoryData object with information about the item to be inserted into the user's inventory
                                        const inventoryData = {
                                            userId: userData.userId,
                                            itemId: userData.itemId,
                                            itemName: itemResults[0].item_name,
                                            description: itemResults[0].description
                                        };
                                        model.insertIntoUserInventory(inventoryData, (error, insertResults, fields) => {
                                            if (error) {
                                                console.error("Error inserting into user inventory:", error);
                                                // If theres an error, it sends a 500 Internal Server Error response
                                                res.status(500).json(error);
                                            } else {
                                                // Purchase successful sends a 200 OK response with a JSON object
                                                res.status(200).json({
                                                    message: "Purchase successful",
                                                    newBalance: newBalance.toString()
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Insufficient balance sends a 400 Bad Request response with a JSON object
                                res.status(400).json({
                                    message: "Insufficient balance to buy the item"
                                });
                            }
                        }
                    }
                });
            }
        }
    });
};