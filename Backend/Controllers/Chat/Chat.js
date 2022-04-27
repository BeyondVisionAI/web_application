const { Chat } = require("../../Models/Chat");
const { Errors } = require("../../Models/Errors")

exports.getMessageFromRoom = function (req, res) {
    console.log("🚀 ~ file: Chat.js ~ line 6 ~ req.params.roomID", req.params.roomID)
    if (!req.params.roomID) {
        return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
    }
    Chat.find({roomID: req.params.roomID}).populate('senderID').exec(async (err, docs) => {
        if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
        return res.status(200).json(docs);
    })
}