const { model, Schema } = require("mongoose");

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
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    }
});

exports.Cart = model("Cart", cart);