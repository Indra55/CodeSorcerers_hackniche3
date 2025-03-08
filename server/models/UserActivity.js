const mongoose = require("mongoose");
const { Schema } = mongoose;

const userActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    activityType: {
        type: String,
        enum: ['VIEW_PRODUCT', 'ADD_TO_CART', 'PURCHASE', 'ADD_TO_WISHLIST', 'REMOVE_FROM_WISHLIST', 'WRITE_REVIEW'],
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: false // Only for product-related activities
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UserActivity", userActivitySchema);
