// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/taskProgressController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// CA2 ENDPOINTS
// Retrieve all the tasks information the user has completed
router.get('/users/:id', jwtMiddleware.verifyToken, controller.readTaskByUserId);
// Creates a task progress which equals completed a task
router.post('/', jwtMiddleware.verifyToken, controller.createNewTaskProgress);


// Retrieve the information of a completed task
router.get('/:id', controller.readTaskById);
// Updates the information of a compelted task
router.put('/:id', controller.updateTaskProgressById);
// Delete the completed task
router.delete('/:id', controller.deleteTaskProgressById);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;