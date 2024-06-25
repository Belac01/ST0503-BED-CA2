// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const taskProgress = require('./taskProgressRoutes');
const shopRoutes = require('./shopRoutes');
const guildRoutes = require('./guildRoutes');
const messageRoutes = require('./messageRoutes');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/task_progress", taskProgress)

router.use("/shop", shopRoutes)
router.use("/guilds", guildRoutes)

router.use("/message", messageRoutes);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;