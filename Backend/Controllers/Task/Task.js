const { Task } = require("../../Models/task/Item")
const { Errors } = require("../../Models/Errors.js");

/**
 * add an item in the Beyond Vision catalog
 * @param { Request } req { body: {name, owner, type, genre, price, language} }
 * @param { Response } res
 * @returns { response to send }
 */
 exports.addTask = async function(req, res) {
    try {
        if (!req.body || (!req.body.employeeId || !req.body.projectId || !req.body.description || !req.body.type))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        
        const newTask = new Task({
            employee: req.body.employeeId,
            projectId: req.body.projectId,
            description: req.body.description,
            type: req.body.type,
            employeeValidate: false,
            clientValidate: false
        })
        await newTask.save();

        res.status(200).send(newTask);
    } catch (err) {
        console.log("Task->addTask: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}