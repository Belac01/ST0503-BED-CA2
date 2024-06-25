// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/shopController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// CA2 ENDPOINTS
// Retrieve the item information in the shop
router.get('/', controller.readAllShop);
// User buys an item from the shop
router.post('/buy/:userId/:itemId', jwtMiddleware.verifyToken, controller.buyItem);


// Creating a new item in the shop
router.post('/', controller.createNewShop);
// Retrieve the item information in the shop
router.get('/', controller.readAllShop);
router.get('/:id', controller.readShopById);
// Updating the details of items in the shop
router.put('/:id', controller.updateShopById);
// Deleting an item from the shop
router.delete('/:id', controller.deleteShopById);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;