// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE INSERT OPERATION FOR GUILD
// ##############################################################
module.exports.getGuildByLeaderId = (userId, callback) => {
    // GET all rows from the "Guild" table where the leader_id matches the provided userId
    const SQL_STATEMENT = `
        SELECT * FROM Guild WHERE leader_id = ?;
    `;

    pool.query(SQL_STATEMENT, [userId], callback);
};

module.exports.createGuild = (data, callback) => {
    // INSERT a new row with the specified guild_name, leader_id, and description into the "Guild" table
    const SQL_STATEMENT = `
        INSERT INTO Guild (guild_name, leader_id, description)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.guild_name, data.leader_id, data.description];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.addUserAsLeader = (data, callback) => {
    // INSERT a new row with the specified user_id, guild_id, role, and the current timestamp as join_date into the "Guild" table
    const SQL_STATEMENT = `
        INSERT INTO GuildMember (user_id, guild_id, role, join_date)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP);
    `;

    const VALUES = [data.user_id, data.guild_id, data.role];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.getGuildByName = (guildName, callback) => {
    // GET all rows from the "Guild" table where the guild_name matches the provided guildName
    const SQL_STATEMENT = `
        SELECT * FROM Guild WHERE guild_name = ?;
    `;

    pool.query(SQL_STATEMENT, [guildName], callback);
};

module.exports.getUserById = (userId, callback) => {
    // GET all rows from the "User" table where the user_id matches the provided userId
    const SQL_STATEMENT = `
        SELECT * FROM User WHERE user_id = ?;
    `;

    pool.query(SQL_STATEMENT, [userId], callback);
};

module.exports.getGuildByUserId = (userId, callback) => {
    // GET guild information of the user_id by doing an inner join between the "Guild" and "GuildMember" tables
    // GET all rows from "Guild" (G.*) where the user_id in "GuildMember" matches the provided userId
    const SQL_STATEMENT = `
        SELECT G.* 
        FROM Guild G
        INNER JOIN GuildMember GM ON G.guild_id = GM.guild_id
        WHERE GM.user_id = ?;
    `;

    pool.query(SQL_STATEMENT, [userId], callback);
};

// ##############################################################
// DEFINE INSERT OPERATION FOR GUILDMEMBER
// ##############################################################
module.exports.isMemberOfGuild = (userId, callback) => {
    // GET all rows from the "Guild" table where the user_id matches the provided userId
    const SQL_STATEMENT = `
        SELECT * FROM GuildMember WHERE user_id = ?;
    `;

    pool.query(SQL_STATEMENT, [userId], callback);
};

module.exports.getGuildById = (guildId, callback) => {
    // GET all rows from the "Guild" table where the guild_id matches the provided guildId
    const SQL_STATEMENT = `
        SELECT * FROM Guild WHERE guild_id = ?;
    `;

    pool.query(SQL_STATEMENT, [guildId], callback);
};

module.exports.joinGuild = (data, callback) => {
    // INSERT a new row with the specified user_id, guild_id, role, and the current timestamp as join_date into the "Guild" table
    const SQL_STATEMENT = `
        INSERT INTO GuildMember (user_id, guild_id, role, join_date)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP);
    `;

    const VALUES = [data.user_id, data.guild_id, data.role];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.getUsernameAndGuildName = (userId, guildId, callback) => {
    // GET the username and guild name of a user by doing an inner join between the "User" and "Guild" tables
    // GET the username from "User" and guild_name from "Guild" where the user's user_id matches userId and the guild's guild_id matches guildId
    const SQL_STATEMENT = `
        SELECT u.username, g.guild_name
        FROM User u
        JOIN Guild g ON u.user_id = ?
        WHERE g.guild_id = ?;
    `;

    pool.query(SQL_STATEMENT, [userId, guildId], callback);
};

// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR GUILD
// ##############################################################
module.exports.selectAllGuilds = (callback) => {
    // GET the selected infromation from the guild table as well as make the username from the table as the leader username and INNERJOIN where the leader id from the guild table is the same as the user id from the user table
    const SQL_STATEMENT = `
        SELECT Guild.guild_id, Guild.guild_name, Guild.description, Guild.creation_date, User.username AS leader_username
        FROM Guild
        INNER JOIN User ON Guild.leader_id = User.user_id;
    `;

    pool.query(SQL_STATEMENT, callback);
};

// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR GUILD BY ID
// ##############################################################
module.exports.selectGuildById = (guildId, callback) => {
    const SQL_STATEMENT = `
        SELECT 
            Guild.guild_id, 
            Guild.guild_name, 
            Guild.description, 
            Guild.creation_date, 
            LeaderUser.user_id AS leader_id,
            LeaderUser.username AS leader_username,
            GuildMember.role, 
            MemberUser.user_id AS member_id,
            MemberUser.username AS member_username
        FROM Guild
        INNER JOIN User AS LeaderUser ON Guild.leader_id = LeaderUser.user_id
        LEFT JOIN GuildMember ON Guild.guild_id = GuildMember.guild_id
        LEFT JOIN User AS MemberUser ON GuildMember.user_id = MemberUser.user_id
        WHERE Guild.guild_id = ?;
    `;

    pool.query(SQL_STATEMENT, [guildId], callback);
};

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR GUILDMEMBER ROLE TO LEADER BY ID
// ##############################################################
module.exports.promoteUserToLeader = (guildId, currentLeaderId, newLeaderId, callback) => {
    const SQL_UPDATE_GUILD_MEMBER = `
        UPDATE GuildMember
        SET role = CASE
            WHEN user_id = ? THEN 'Member'
            WHEN user_id = ? THEN 'Leader'
            ELSE role
        END
        WHERE guild_id = ?;
    `;

    const SQL_UPDATE_GUILD_LEADER = `
        UPDATE Guild
        SET leader_id = ?
        WHERE guild_id = ?;
    `;

    // Arrays hold the values to be substituted in the SQL queries using placeholders (?)
    const VALUES_MEMBER_UPDATE = [currentLeaderId, newLeaderId, guildId];
    const VALUES_GUILD_UPDATE = [newLeaderId, guildId];

    // getConnection method is asynchronous and takes a callback function, which receives an error (err) and a connection object (connection)
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null);
        }

        // connection is obtained, the code begins a transaction using the beginTransaction method on the connection object
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return callback(err, null);
            }

            // Executes the first SQL query to update the roles of guild members in the GuildMember table
            connection.query(SQL_UPDATE_GUILD_MEMBER, VALUES_MEMBER_UPDATE, (error, resultsMemberUpdate) => {
                if (error) {
                    // If an error occurs during the execution of the query, rolls back the transaction using connection.rollback() releases the connection, and calls the callback with the error
                    return connection.rollback(() => {
                        connection.release();
                        callback(error, null);
                    });
                }

                // Executes the second SQL query to update the leader in the Guild table
                connection.query(SQL_UPDATE_GUILD_LEADER, VALUES_GUILD_UPDATE, (error, resultsGuildUpdate) => {
                    if (error) {
                        // If an error occurs during the execution of the query, rolls back the transaction using connection.rollback() releases the connection, and calls the callback with the error
                        return connection.rollback(() => {
                            connection.release();
                            callback(error, null);
                        });
                    }

                    // If both queries are successful, the code commits the transaction using the commit method on the connection
                    connection.commit((err) => {
                        if (err) {
                            //  Error occurs during the commit, the code rolls back the transaction, releases the connection, and calls the callback with the commit error
                            return connection.rollback(() => {
                                connection.release();
                                callback(err, null);
                            });
                        }

                        // After a successful commit, the code releases the database connection using connection.release()
                        connection.release();
                        // Calls the callback with null for the error (indicating success) and the results of the second query
                        callback(null, resultsGuildUpdate);
                    });
                });
            });
        });
    });
};

module.exports.checkUserIsLeaderAndSameGuild = (guildId, currentLeaderId, newLeaderId, callback) => {
    // Checks if the currentLeaderId is equal to the newLeaderId.
    if (currentLeaderId === newLeaderId) {
        // Same, it invokes the callback with an error object containing a message and null for results then return to give up
        callback({
            message: 'Current leader ID and new leader ID cannot be the same',
        }, null);
        return;
    }

    // SQL query stored as a template string. It uses subqueries to count the occurrences of specific conditions in the GuildMember table
    // 1st one check if user is leader in the guild and the 2nd one checks if user is a member of the same guild
    const SQL_STATEMENT = `
        SELECT
            (SELECT COUNT(*) FROM GuildMember WHERE guild_id = ? AND user_id = ? AND role = 'Leader') AS isLeader,
            (SELECT COUNT(*) FROM GuildMember WHERE guild_id = ? AND user_id = ?) AS isSameGuild;
    `;

    // Represent the values for the placeholders (?) in the query
    const VALUES = [guildId, currentLeaderId, guildId, newLeaderId];

    pool.query(SQL_STATEMENT, VALUES, (error, results) => {
        if (error) {
            // Error occurs during the query execution, the callback gets error and null for results
            callback(error, null);
        } else {
            // No error, the callback gets null for the error and an object representing the results
            callback(null, {
                isLeader: results[0].isLeader > 0, // Shows whether the currentLeaderId is the leader in the specified guild
                isSameGuild: results[0].isSameGuild > 0, // Shows whether the newLeaderId is a member of the specified guild
            });
        }
    });
};

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR GUILDMEMBER ROLE TO OFFICER BY ID
// ##############################################################
module.exports.promoteMemberToOfficer = (guildId, currentLeaderId, newOfficerId, callback) => {
    const SQL_UPDATE_GUILD_MEMBER = `
        UPDATE GuildMember
        SET role = CASE
            WHEN user_id = ? AND role = 'Leader' THEN 'Leader'
            WHEN user_id = ? THEN 'Officer'
            ELSE role
        END
        WHERE guild_id = ?;
    `;

    // Arrays hold the values to be substituted in the SQL queries using placeholders (?)
    const VALUES_MEMBER_UPDATE = [currentLeaderId, newOfficerId, guildId];

    // getConnection method is asynchronous and takes a callback function, which receives an error (err) and a connection object (connection)
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null);
        }

        // connection is obtained, the code begins a transaction using the beginTransaction method on the connection object
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return callback(err, null);
            }

            // Executes the first SQL query to update the roles of guild members in the GuildMember table
            connection.query(SQL_UPDATE_GUILD_MEMBER, VALUES_MEMBER_UPDATE, (error, resultsMemberUpdate) => {
                if (error) {
                    // If an error occurs during the execution of the query, rolls back the transaction using connection.rollback() releases the connection, and calls the callback with the error
                    return connection.rollback(() => {
                        connection.release();
                        callback(error, null);
                    });
                }

                // If both queries are successful, the code commits the transaction using the commit method on the connection
                connection.commit((err) => {
                    if (err) {
                        //  Error occurs during the commit, the code rolls back the transaction, releases the connection, and calls the callback with the commit error
                        return connection.rollback(() => {
                            connection.release();
                            callback(err, null);
                        });
                    }

                    // After a successful commit, the code releases the database connection using connection.release()
                    connection.release();
                    // Calls the callback with null for the error (indicating success) and the results of the query
                    callback(null, resultsMemberUpdate);
                });
            });
        });
    });
};

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR GUILDMEMBER ROLE TO OFFICER BY ID
// ##############################################################
module.exports.demoteOfficerToMember = (guildId, currentLeaderId, currentOfficerId, callback) => {
    const SQL_UPDATE_GUILD_MEMBER = `
        UPDATE GuildMember
        SET role = CASE
            WHEN user_id = ? AND role = 'Leader' THEN 'Leader'
            WHEN user_id = ? THEN 'Member'
            ELSE role
        END
        WHERE guild_id = ?;
    `;

    // Arrays hold the values to be substituted in the SQL queries using placeholders (?)
    const VALUES_MEMBER_UPDATE = [currentLeaderId, currentOfficerId, guildId];

    // getConnection method is asynchronous and takes a callback function, which receives an error (err) and a connection object (connection)
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null);
        }

        // connection is obtained, the code begins a transaction using the beginTransaction method on the connection object
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return callback(err, null);
            }

            // Executes the first SQL query to update the roles of guild members in the GuildMember table
            connection.query(SQL_UPDATE_GUILD_MEMBER, VALUES_MEMBER_UPDATE, (error, resultsMemberUpdate) => {
                if (error) {
                    // If an error occurs during the execution of the query, rolls back the transaction using connection.rollback() releases the connection, and calls the callback with the error
                    return connection.rollback(() => {
                        connection.release();
                        callback(error, null);
                    });
                }

                // If both queries are successful, the code commits the transaction using the commit method on the connection
                connection.commit((err) => {
                    if (err) {
                        //  Error occurs during the commit, the code rolls back the transaction, releases the connection, and calls the callback with the commit error
                        return connection.rollback(() => {
                            connection.release();
                            callback(err, null);
                        });
                    }

                    // After a successful commit, the code releases the database connection using connection.release()
                    connection.release();
                    // Calls the callback with null for the error (indicating success) and the results of the query
                    callback(null, resultsMemberUpdate);
                });
            });
        });
    });
};

// ##############################################################
// DEFINE DELETE OPERATIONS FOR GUILDMEMBER BY ID
// ##############################################################
module.exports.leaveGuild = (data, callback) => {
    // Extracts the user ID from the data object.
    const userId = data.userId;

    // Check if the user is a leader in the guild
    const checkLeaderQuery = `
    SELECT role
    FROM GuildMember
    WHERE user_id = ? AND role = 'leader';
    `;

    pool.query(checkLeaderQuery, [userId], (error, results, fields) => {
        if (error) {
            // Error then callback is invoked with the error and null for results
            console.error("Error leaveGuild (checkLeaderQuery):", error);
            callback(error, null);
        } else {
            if (results.length > 0) {
                // User is a leader, prevent leaving the guild
                callback(null, { message: "Leaders cannot leave the guild." });
            } else {
                // User is not a leader, proceed to leave the guild
                const deleteMemberQuery = `
                DELETE FROM GuildMember
                WHERE user_id = ?;
                `;

                // Used to execute the delete query, and the callback function is used to handle errors and results
                pool.query(deleteMemberQuery, [userId], callback);
            }
        }
    });
};

// ##############################################################
// DEFINE DELETE OPERATIONS FOR GUILDMEMBER BY ID BY KICK
// ##############################################################
module.exports.kickMember = (data, callback) => {
    // Retrieves the guildId, officerId, and memberId from the data object
    const guildId = data.guildId;
    const officerId = data.officerId;
    const memberId = data.memberId;

    // Check if the requester is the leader of the guild
    const checkLeaderQuery = `
    SELECT role
    FROM GuildMember
    WHERE user_id = ? AND guild_id = ? AND role = 'leader';
    `;

    pool.query(checkLeaderQuery, [officerId, guildId], (error, results, fields) => {
        if (error) {
            // Error during the query execution, the callback is invoked with the error and null for results
            console.error("Error kickMember (checkLeaderQuery):", error);
            callback(error, null);
        } else {
            if (results.length > 0) {
                // Requester is a leader, prevent leader from kicking themselves
                if (memberId === officerId) {
                    callback(null, { message: "Leaders cannot kick themselves out of the guild" });
                } else {
                    // New SQL query is executed to delete the user
                    const deleteMemberQuery = `
                    DELETE FROM GuildMember
                    WHERE user_id = ? AND guild_id = ?;
                    `;

                    // Execute a delete query to remove the member from the guild
                    pool.query(deleteMemberQuery, [memberId, guildId], callback);
                }
            } else {
                // Requester is not a leader, check if they are an officer
                const checkOfficerQuery = `
                SELECT role
                FROM GuildMember
                WHERE user_id = ? AND guild_id = ? AND role = 'officer';
                `;

                pool.query(checkOfficerQuery, [officerId, guildId], (error, officerResults, officerFields) => {
                    if (error) {
                        console.error("Error kickMember (checkOfficerQuery):", error);
                        callback(error, null);
                    } else {
                        if (officerResults.length > 0) {
                            // Requester is an officer, prevent officer from kicking themselves
                            if (memberId === officerId) {
                                callback(null, { message: "Officers cannot kick themselves out of the guild" });
                            } else {
                                // New SQL query is executed to delete the user
                                const deleteMemberQuery = `
                                DELETE FROM GuildMember
                                WHERE user_id = ? AND guild_id = ? AND role = 'member';
                                `;

                                // Execute a delete query to remove the member from the guild
                                pool.query(deleteMemberQuery, [memberId, guildId], callback);
                            }
                        } else {
                            // Requester is neither a leader nor an officer, deny permission
                            callback(null, { message: "Insufficient permission to kick members" });
                        }
                    }
                });
            }
        }
    });
};

// ##############################################################
// DEFINE DELETE OPERATIONS FOR GUILD BY ID
// ##############################################################
module.exports.disbandGuild = (guildId, userId, callback) => {
    const SELECT_LEADER_SQL = `
        SELECT leader_id FROM Guild
        WHERE guild_id = ?;
    `;

    const DELETE_GUILD_SQL = `
        DELETE FROM GuildMember
        WHERE guild_id = ?;

        DELETE FROM Guild
        WHERE guild_id = ? AND leader_id = ?;
    `;

    // Executes the first SQL query to select the leader of the specified guild
    pool.query(SELECT_LEADER_SQL, [guildId], (error, results, fields) => {
        if (error) {
            //  Error during the query execution, the callback is invoked with the error and null for results and fields
            callback(error, null, null);
        } else {
            if (results.length === 0) {
                // Guild not found
                callback(null, { affectedRows: 0 }, null);
            } else {
                // Proceeds to check if the user making the request is the leader of the guild below
                const leaderId = results[0].leader_id;

                // Check if the user making the request is the leader
                if (leaderId === userId) {
                    // Second SQL query to delete the guild and its members
                    pool.query(DELETE_GUILD_SQL, [guildId, guildId, userId], callback);
                } else {
                    callback(null, { affectedRows: 0 }, null); // User is not the leader
                }
            }
        }
    });
};
