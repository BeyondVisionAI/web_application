const { Schema, model } = require("mongoose");

const chat = new Schema(
    {
        senderID: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        roomID: String,
        message: String,
    },
    { 
        timestamps: true
    }
);

exports.Chat = model("Chat", chat);