// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/userController');
const middleware = require('../middlewares/middleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// CA2 ENDPOINTS
// Creating a new user
router.post("/register", controller.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, controller.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
// Login into existing user
router.post("/login", controller.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
// Retrieve the user information
router.get('/', controller.readAllUser);
router.get('/:id', jwtMiddleware.verifyToken, controller.readUserById);
// Updating the user information
router.put('/:id', jwtMiddleware.verifyToken, middleware.checkUserById, controller.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, controller.updateUserById);
// Retrieve the user profile which contains every information the user has
router.get('/:id/profile', jwtMiddleware.verifyToken, controller.readUserProfile);
// Retrieve the user inventory
router.get('/:id/inventory', jwtMiddleware.verifyToken, controller.readUserInventory);
// Delete an item from the user inventory
router.delete('/:id/inventory/:inventoryid', controller.deleteUserInventoryById);


// Deleting a user
router.delete('/:id', controller.deleteUserById);
// Retrieve a user wallet information to check balance
router.get('/:id/wallet', controller.readUserWallets);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;