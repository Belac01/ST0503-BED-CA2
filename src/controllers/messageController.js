// ##############################################################
// REQUIRE MODULES
// ##############################################################

const model = require("../models/messageModel.js");
const pool = require("../services/db.js");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE MESSAGE
// ##############################################################
module.exports.createMessage = (req, res, next) => {
    if(req.body.message_text == undefined || req.body.message_text == "")
    {
        res.status(400).send("Error: message_text is undefined");
        return;
    }
    else if(req.body.user_id == undefined)
    {
        res.status(400).send("Error: user_id is undefined");
        return;
    }

    const data = {
        user_id: req.body.user_id,
        message_text: req.body.message_text
    }

    console.log("data", data);

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createMessage:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results);
        }
    }

    model.insertSingle(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ MESSAGE BY ID
// ##############################################################
module.exports.readMessageById = (req, res, next) => {
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readMessageById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Message not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ MESSAGE
// ##############################################################
module.exports.readAllMessage = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllMessage:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    model.selectAll(callback);
}

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE MESSAGE BY ID
// ##############################################################
module.exports.updateMessageById = (req, res, next) => {
    if(req.params.id == undefined)
    {
        res.status(400).json({error: "id is undefined"});
        return;
    }
    else if(req.body.message_text == undefined || req.body.message_text == "")
    {
        res.status(400).json({error: "message_text is undefined or empty"});
        return;
    }
    else if(req.body.user_id == undefined)
    {
        res.status(400).json({error: "userId is undefined"});
        return;
    }

    const data = {
        id: req.params.id,
        user_id: req.body.user_id,
        message_text: req.body.message_text,
        updated_at: new Date() // Add the current date and time as the updated_at timestamp
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateMessageById:", error);
            res.status(500).json({error: error});
        } else {
            res.status(200).json(results);
        }
    }

    model.updateById(data, callback);
}


// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE MESSAGE BY ID
// ##############################################################
module.exports.deleteMessageById = (req, res, next) => {
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteMessageById:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    model.deleteById(data, callback);
}