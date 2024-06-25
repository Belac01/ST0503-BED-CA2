// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/guildController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// CA2 Endpoints
// Guild creation
router.post('/create/:userId', jwtMiddleware.verifyToken, controller.createGuild);
// Joining guild
router.post('/join/:guildId/:userId', jwtMiddleware.verifyToken, controller.joinGuild);
// Retrieve guilds information
router.get('/', controller.readAllGuilds);
router.get('/:guildid', controller.readGuildById);
// Leaving guild
router.delete('/leave/:userId', jwtMiddleware.verifyToken, controller.leaveGuild);
router.delete('/disband/:guildId/:userId', jwtMiddleware.verifyToken, controller.disbandGuild);


// Promoting and demoting of roles 
router.put('/promoteleader/:guildId/:currentLeaderUserId/:newLeaderUserId', controller.promoteUserToLeader);
router.put('/promoteofficer/:guildId/:currentLeaderUserId/:newOfficerUserId', controller.promoteMemberToOfficer);
router.put('/demoteofficer/:guildId/:currentLeaderUserId/:currentOfficerUserId', controller.demoteOfficerToMember);

// Leaving guild
router.delete('/kick/:guildId/:officerUserId/:memberUserId', controller.kickMember);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;