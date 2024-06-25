// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/guildModel.js");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE GUILD
// ##############################################################
module.exports.createGuild = (req, res) => {
    // Check if the required parameters (guild_name and description) are present in the request body
    if (!req.body.guild_name || !req.body.description) {
        // If not present, it returns a 400 Bad Request response
        res.status(400).send("Error: Guild name or description is undefined");
        return;
    }
    // Retrieves the userId from the parameters of the HTTP request
    const userId = req.params.userId;

    // Check if the user exists
    model.getUserById(userId, (userError, userResult) => {
        if (userError) {
            console.error("Error checking user existence:", userError);
            // If an error occurs, it returns a 500 Internal Server Error
            res.status(500).json(userError);
        } else if (userResult.length === 0) {
            // If the user is not found, it returns a 404 Not Found response
            res.status(404).send("Error: User not found");
        } else {
            // Check if the user is already a member of any guild
            model.getGuildByUserId(userId, (guildError, guildResult) => {
                if (guildError) {
                    console.error("Error checking existing guild membership:", guildError);
                    // If an error occurs, it returns a 500 Internal Server Error
                    res.status(500).json(guildError);
                } else if (guildResult.length > 0) {
                    // If the user is already a member, it returns a 409 Conflict response
                    res.status(403).json({ "error": "User already has a guild" }); 
                } else {
                    // Check if the user already has a guild
                    model.getGuildByLeaderId(userId, (error, result) => {
                        if (error) {
                            console.error("Error checking existing guild:", error);
                            // If an error occurs, it returns a 500 Internal Server Error
                            res.status(500).json(error); 
                        } else if (result.length > 0) {
                            // If the user is a leader, it returns a 409 Conflict response
                            res.status(403).json({ "error": "User already has a guild" });
                        } else {
                            const data = {
                                guild_name: req.body.guild_name,
                                leader_id: userId,
                                description: req.body.description,
                            };

                            // Check if the guild name already exists
                            model.getGuildByName(data.guild_name, (guildError, guildResult) => {
                                if (guildError) {
                                    console.error("Error checking existing guild name:", guildError);
                                    // If an error occurs, it returns a 500 Internal Server Error
                                    res.status(500).json(guildError); 
                                } else if (guildResult.length > 0) {
                                    // If the guild name exists, it returns a 409 Conflict response
                                    res.status(409).json({ "error": "Guild name already exists" }); 
                                } else {
                                    const callback = (error, results, fields) => {
                                        if (error) {
                                            console.error("Error creating guild:", error);
                                            // If an error occurs during the creation, it returns a 500 Internal Server Error
                                            res.status(500).json(error); 
                                        // Else, it continues by adding the user as the leader to the GuildMember table below   
                                        } else {
                                            const guildId = results.insertId;

                                            // Add the user as the leader to GuildMember table with the corresponding guildId
                                            const leaderData = {
                                                user_id: userId,
                                                guild_id: guildId,
                                                role: "Leader",
                                            };

                                            const leaderCallback = (leaderError, leaderResults, leaderFields) => {
                                                if (leaderError) {
                                                    console.error("Error adding user as leader:", leaderError);
                                                    // If an error occurs during the adding, it returns a 500 Internal Server Error
                                                    res.status(500).json(leaderError);
                                                } else {
                                                    // Get the leader username
                                                    const leaderUsername = userResult[0].username;

                                                    // Response object containing information about the newly created guild
                                                    const response = {
                                                        guild_id: guildId,
                                                        guild_name: data.guild_name,
                                                        leader_username: leaderUsername, // Change leader_id to leader's username from above
                                                        description: data.description,
                                                    };
                                                    // Sends a 201 Created response
                                                    res.status(201).json(response); 
                                                }
                                            };

                                            model.addUserAsLeader(leaderData, leaderCallback);
                                        }
                                    };

                                    model.createGuild(data, callback);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE GUILDMEMBER
// ##############################################################
module.exports.joinGuild = (req, res) => {
    // Retrieves the guildId and userId from the parameters of the HTTP request.
    const guildId = req.params.guildId;
    const userId = req.params.userId;

    // Check if the user exists
    model.getUserById(userId, (userError, userResult) => {
        if (userError) {
            console.error("Error checking user existence:", userError);
            // If an error occurs, it returns a 500 Internal Server Error
            res.status(500).json(userError); 
        } else if (userResult.length === 0) {
            // If the user is not found, it returns a 404 Not Found response
            res.status(404).send("Error: User not found"); 
        } else {
            // Check if the user is already a member of a guild
            model.isMemberOfGuild(userId, (error, result) => {
                if (error) {
                    console.error("Error checking existing guild membership:", error);
                    // If an error occurs, it returns a 500 Internal Server Error
                    res.status(500).json(error); 
                } else if (result.length > 0) {
                    // If the user is already a member, it returns a 409 Conflict response
                    res.status(409).json({ "error": "User already has a guild" });
                } else {
                    // Check if the guild exists
                    model.getGuildById(guildId, (guildError, guildResult) => {
                        if (guildError) {
                            console.error("Error checking guild existence:", guildError);
                            // If an error occurs, it returns a 500 Internal Server Error
                            res.status(500).json(guildError); 
                        } else if (guildResult.length === 0) {
                            // If the guild is not found, it returns a 404 Not Found response
                            res.status(404).send("Error: Guild not found");
                        // Proceeds to add the user to the guild using the provided data 
                        } else {
                            const data = {
                                user_id: userId,
                                guild_id: guildId,
                                role: "Member",
                            };

                            const callback = (joinError, joinResults, fields) => {
                                if (joinError) {
                                    console.error("Error joining guild:", joinError);
                                    // If an error occurs during the join operation, it returns a 500 Internal Server Error
                                    res.status(500).json(joinError);
                                } else {
                                    // Retrieve username and guild name
                                    model.getUsernameAndGuildName(userId, guildId, (nameError, nameResult) => {
                                        if (nameError) {
                                            console.error("Error retrieving username and guild name:", nameError);
                                            // If an error occurs during this retrieval, it returns a 500 Internal Server Error
                                            res.status(500).json(nameError);
                                        } else {
                                            // Response object containing information about the user's membership in the guild 
                                            const response = {
                                                membership_id: joinResults.insertId,
                                                username: nameResult[0].username,
                                                guild_name: nameResult[0].guild_name,
                                                role: data.role,
                                            };
                                            res.status(201).json(response); // Sends a 201 Created response
                                        }
                                    });
                                }
                            };

                            model.joinGuild(data, callback);
                        }
                    });
                }
            });
        }
    });
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ ALL GUILD
// ##############################################################
module.exports.readAllGuilds = (req, res, next) => {
    // Callback function that will be used to handle the results of the database query
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllGuilds:", error);
            // If there is an error, it will log the error to the console and also sends a 500 Internal Server Error
            res.status(500).json(error);
        } else {
            // If there is no error, it sends a 200 OK response with the results of the database query
            res.status(200).json(results);
        }
    };
    // Uses a method on the model to retrieve all guilds from the database. The results are passed to the defined callback function
    model.selectAllGuilds(callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ ALL GUILD BY ID
// ##############################################################
module.exports.readGuildById = (req, res, next) => {
    // Retrieves the guildId from the parameters of the HTTP request
    const guildId = req.params.guildid;
    // Defines a callback function
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readGuildById:", error);
            // If there is an error, sends a 500 Internal Server Error 
            res.status(500).json(error);
        } else {
            if (results.length > 0) {
                // Creates a response object of guildInfo
                const guildInfo = {
                    // Retrieves the guild_id property from the first row of the results array
                    guild_id: results[0].guild_id,
                    // Retrieves the guild_name property from the first row of the results array
                    guild_name: results[0].guild_name,
                    // Retrieves the description property from the first row of the results array
                    description: results[0].description,
                    // Retrieves the creation_date property from the first row of the results array 
                    creation_date: results[0].creation_date,
                    // Retrieves the leader_id property from the first row of the results array
                    leader_id: results[0].leader_id,
                    // Retrieves the leader_username property from the first row of the results array
                    leader_username: results[0].leader_username,
                    // Array of objects representing guild members
                    members: results.map((row) => ({ 
                        // Iterates over each row in the results array and creates a new object with three propertiesfor each member
                        role: row.role,
                        user_id: row.member_id,
                        username: row.member_username,
                    })),
                };
                // Sends a 200 OK response with the guildInfo object
                res.status(200).json(guildInfo);
            } else {
                // If no results are found, it sends a 404 Not Found response with a message indicating that the guild was not found
                res.status(404).json({ message: "Guild not found" });
            }
        }
    };
    // Uses a method on the model to retrieve information about the guild with the specified ID then passed to the defined callback function.
    model.selectGuildById(guildId, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE GUILDMEMBER TO LEADER ROLE BY ID
// ##############################################################
module.exports.promoteUserToLeader = (req, res) => {
    // Retrieves the guildId, currentLeaderId, and newLeaderId from the parameters of the HTTP request
    const guildId = req.params.guildId;
    const currentLeaderId = req.params.currentLeaderUserId;
    const newLeaderId = req.params.newLeaderUserId;

    // Checks if the required parameters (guildId, currentLeaderId, and newLeaderId) are present in the request
    if (!guildId || !currentLeaderId || !newLeaderId) {
        // Returns a 400 Bad Request response if these conditions are not met
        res.status(400).json({
            message: 'Error: Guild ID, current leader ID, or new leader ID is missing',
        });
        return;
    }

    // Checks if the currentLeaderId is the same as the newLeaderId
    if (currentLeaderId === newLeaderId) {
        // Returns a 400 Bad Request response if these conditions are not met
        res.status(400).json({
            message: 'Error: Current leader ID and new leader ID cannot be the same',
        });
        return;
    }

    const callback = (error, results) => {
        if (error) {
            console.error('Error promoting user to leader:', error);
            // If there is an error, sends a 500 Internal Server Error
            res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                // If no rows were affected in the database (no guild or users found), it returns a 404 Not Found response
                res.status(404).json({
                    message: 'Guild or users not found',
                });
            } else if (results.isSameGuild === 0) {
                // If the users are not in the same guild, it returns a 403 Forbidden response
                res.status(403).json({
                    message: 'Permission denied. The user is not in the same guild.',
                });
            } else {
                // Sends a 200 OK response indicating that the user has been successfully promoted to the leader role
                res.status(200).json({
                    message: 'User promoted to leader successfully',
                });
            }
        }
    };

    // Additional checks:
    // 1. Only the current leader can promote a user to leader.
    // 2. Ensure the user is in the same guild.
    model.checkUserIsLeaderAndSameGuild(guildId, currentLeaderId, newLeaderId, (error, results) => {
        if (error) {
            console.error('Error checking user role or guild membership:', error);
            // Sends a 500 Internal Server Error response
            res.status(500).json(error); 
        } else {
            if (results.isLeader && results.isSameGuild) {
                // Only proceed if the current user is a leader and the leader is in the same guild
                model.promoteUserToLeader(guildId, currentLeaderId, newLeaderId, callback);
            } else {
                res.status(400).json({
                    // Returns a 400 Bad Request response if these conditions are not met
                    message: 'Permission denied. Only the current leader of the guild can transfer leadership to another user of the same guild.',
                });
            }
        }
    });
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE GUILDMEMBER TO OFFICER ROLE BY ID
// ##############################################################
module.exports.promoteMemberToOfficer = (req, res) => {
    // Retrieves the guildId, currentLeaderId, and newOfficerId from the parameters of the HTTP request
    const guildId = req.params.guildId;
    const currentLeaderId = req.params.currentLeaderUserId;
    const newOfficerId = req.params.newOfficerUserId;

    // Checks if the required parameters (guildId, currentLeaderId, and newOfficerId) are present in the request
    if (!guildId || !currentLeaderId || !newOfficerId) {
        // Returns a 400 Bad Request response if these conditions are not met
        res.status(400).json({ 
            message: 'Error: Guild ID, current leader ID, or new officer ID is missing',
        });
        return;
    }

    // Checks if the currentLeaderId is the same as the newOfficerId
    if (currentLeaderId === newOfficerId) {
        // Returns a 400 Bad Request response if these conditions are not met
        res.status(400).json({
            message: 'Error: Current leader ID and new officer ID cannot be the same',
        });
        return;
    }

    // Defines a callback function
    const callback = (error, results) => {
        if (error) {
            console.error('Error promoting user to officer:', error);
            // If there is an error, sends a 500 Internal Server Error
            res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                // If no rows were affected in the database (no guild or users found), it returns a 404 Not Found response
                res.status(404).json({
                    message: 'Guild or users not found',
                });
            } else if (results.isSameGuild === 0) {
                // If the users are not in the same guild, it returns a 403 Forbidden response
                res.status(403).json({
                    message: 'Permission denied. The user is not in the same guild.',
                });
            } else {
                // Sends a 200 OK response indicating that the user has been successfully promoted to the officer role
                res.status(200).json({
                    message: 'User promoted to officer successfully',
                });
            }
        }
    };

    // Additional checks:
    // 1. Only the current leader can promote a user to officer.
    // 2. Ensure the user is in the same guild.
    model.checkUserIsLeaderAndSameGuild(guildId, currentLeaderId, newOfficerId, (error, results) => {
        if (error) {
            console.error('Error checking user role or guild membership:', error);
            // Sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if (results.isLeader && results.isSameGuild) {
                // Only proceed if the current user is a leader and the new officer is in the same guild
                model.promoteMemberToOfficer(guildId, currentLeaderId, newOfficerId, callback);
            } else {
                // Returns a 400 Bad Request response if these conditions are not met
                res.status(400).json({
                    message: 'Permission denied. Only the current leader of the guild can promote another user of the same guild to officer.',
                });
            }
        }
    });
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE GUILDMEMBER TO MEMBER ROLE BY ID
// ##############################################################
module.exports.demoteOfficerToMember = (req, res) => {
    // Retrieves the guildId, currentLeaderId, and currentOfficerId from the parameters of the HTTP request
    const guildId = req.params.guildId;
    const currentLeaderId = req.params.currentLeaderUserId;
    const currentOfficerId = req.params.currentOfficerUserId;

    // Checks if the required parameters (guildId, currentLeaderId, and currentOfficerId) are present in the request
    if (!guildId || !currentLeaderId || !currentOfficerId) {
        res.status(400).json({
            message: 'Error: Guild ID, current leader ID, or current officer ID is missing',
        });
        return;
    }

    // Checks if the currentLeaderId is the same as the currentOfficerId
    if (currentLeaderId === currentOfficerId) {
        res.status(400).json({
            message: 'Error: Current leader ID and current officer ID cannot be the same',
        });
        return;
    }

    // Defines a callback function
    const callback = (error, results) => {
        if (error) {
            console.error('Error demoting officer to member:', error);
            // If there is an error, sends a 500 Internal Server Error
            res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                // If no rows were affected in the database (no guild or users found), it returns a 404 Not Found response
                res.status(404).json({
                    message: 'Guild or users not found',
                });
            } else if (results.isSameGuild === 0) {
                // If the users are not in the same guild, it returns a 403 Forbidden response
                res.status(403).json({
                    message: 'Permission denied. The user is not in the same guild.',
                });
            } else {
                // Sends a 200 OK response indicating that the user has been successfully demoted to the member role
                res.status(200).json({
                    message: 'Officer demoted to member successfully',
                });
            }
        }
    };

    // Additional checks:
    // 1. Only the current leader can demote an officer.
    // 2. Ensure the user is in the same guild.
    model.checkUserIsLeaderAndSameGuild(guildId, currentLeaderId, currentOfficerId, (error, results) => {
        if (error) {
            console.error('Error checking user role or guild membership:', error);
            // Sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if (results.isLeader && results.isSameGuild) {
                // Only proceed if the current user is a leader and the officer is in the same guild.
                model.demoteOfficerToMember(guildId, currentLeaderId, currentOfficerId, callback);
            } else {
                res.status(403).json({
                    // Returns a 403 Forbidden response if these conditions are not met
                    message: 'Permission denied. Only the current leader of the guild can demote an officer of the same guild to member.',
                });
            }
        }
    });
};


// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE GUILDMEMBER BY ID
// ##############################################################
module.exports.leaveGuild = (req, res, next) => {
    // Retrieves the userId from the parameters of the HTTP request
    const userId = req.params.userId;

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error leaveGuild:", error);
            // Sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if (results && results.message) {
                // If the results contain a message, it means the user is a leader
                res.status(403).json({
                    // Returns a 403 Forbidden response with the message
                    message: results.message
                });
            } else if (results && results.affectedRows === 0) {
                // If the results indicate that no rows were affected, it returns a 404 Not Found response
                res.status(404).json({
                    message: "Not currently in a guild"
                });
            } else {
                res.status(204).send(); // 204 No Content
            }
        }
    };

    // The userId is passed as an object to the method
    model.leaveGuild({ userId }, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE GUILDMEMBER BY ID BY KICK
// ##############################################################
module.exports.kickMember = (req, res, next) => {
    // Retrieves the guildId, officerId, and memberId from the parameters of the HTTP request
    const guildId = req.params.guildId;
    const officerId = req.params.officerUserId;
    const memberId = req.params.memberUserId;

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error kickMember:", error);
            // Sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if (results && results.message) {
                // If the results contain a message, it means the user doesn't have permission
                res.status(403).json({
                    // Returns a 403 Forbidden response with the message
                    message: results.message
                });
            } else if (results && results.affectedRows === 0) {
                // No rows were affected (member not found or not in the specified guild), it returns a 404 Not Found response
                res.status(404).json({
                    message: "Member not found or not in the specified guild"
                });
            } else {
                res.status(204).send(); // 204 No Content
            }
        }
    };

    // The guildId, officerId, and memberId are passed as an object to the method
    model.kickMember({ guildId, officerId, memberId }, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE GUILD BY ID
// ##############################################################
module.exports.disbandGuild = (req, res, next) => {
    // retrieves the guildId and userId from the parameters of the HTTP request
    const guildId = Number(req.params.guildId);
    const userId = Number(req.params.userId);

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error disbandGuild:", error);
            // sends a 500 Internal Server Error response
            res.status(500).json(error);
        } else {
            if (results && results.affectedRows === 0) {
                // no rows were affected (guild not found, user not found, or the user is not the leader), it returns a 404 Not Found response
                res.status(404).json({
                    message: "You are not the leader",
                });
            } else if (results && results.warningStatus === 0) {
                // results.warningStatus is 0, it means the operation was successful with no warnings, and it returns a 204 No Content response
                res.status(204).send(); // 204 No Content
            } else {
                res.status(200).json({
                    message: "Successful disbanding of guild",
                });
            }
        }
    };

    // The guildId and userId are passed as arguments to the method
    model.disbandGuild(guildId, userId, callback);
};