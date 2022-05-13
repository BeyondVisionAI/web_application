const { Schema } = require("mongoose");

const cart = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    bought: {
        type: Schema.Types.Boolean,
        default: false,
        required: true
    }
});

exports.Cart = model("Cart", cart);