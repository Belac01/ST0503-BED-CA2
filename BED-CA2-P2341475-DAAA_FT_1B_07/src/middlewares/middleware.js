// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/userModel.js");

// Middleware to check if the provided email is already in use
module.exports.checkEmailExistence = (req, res, next) => {
    const email = req.body.email;

    model.getUserByEmail(email, (error, results, fields) => {
        if (error) {
            console.error("Error getUserByEmail in middleware:", error);
            res.status(500).json(error);
        } else {
            if (results.length > 0) {
                res.status(409).send("Conflict: Email already in use");
            } else {
                // Email is not in use, continue to the next middleware or the controller
                next();
            }
        }
    });
};

// Middleware to check if the provided username is already in use
module.exports.checkUsernameExistence = (req, res, next) => {
    const username = req.body.username;

    model.getUserByUsername(username, (error, results, fields) => {
        if (error) {
            console.error("Error getUserByUsername in middleware:", error);
            res.status(500).json(error);
        } else {
            if (results.length > 0) {
                res.status(409).send("Conflict: Username already in use");
            } else {
                // Username is not in use, continue to the next middleware or the controller
                next();
            }
        }
    });
};

// Middleware to check if the user with the requested ID exists
module.exports.checkUserById = (req, res, next) => {
    const userId = req.params.id;

    model.getUserById(userId, (getUserError, getUserResults, getUserFields) => {
        if (getUserError) {
            console.error("Error getUserById:", getUserError);
            res.status(500).json(getUserError);
        } else {
            if (getUserResults.length === 0) {
                res.status(404).json({
                    message: "User not found"
                });
            } else {
                // Attach user information to request for later use in the route handler
                req.user = getUserResults[0];
                next();
            }
        }
    });
};
