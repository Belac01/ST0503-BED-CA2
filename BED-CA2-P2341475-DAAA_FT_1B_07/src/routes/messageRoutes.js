// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/messageController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// CA2 ENDPOINTS
// Retrieve all messages
router.get('/', controller.readAllMessage);
// Create a new message 
router.post('/', jwtMiddleware.verifyToken, controller.createMessage);
// Update an existing message
router.put('/:id', jwtMiddleware.verifyToken, controller.updateMessageById);
// Delete an existing message
router.delete('/:id', jwtMiddleware.verifyToken, controller.deleteMessageById);


router.get('/:id', controller.readMessageById);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;