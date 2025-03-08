const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [Schema.Types.Mixed], // List of purchased products
        required: true
    },
    address: {
        type: [Schema.Types.Mixed],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMode: {
        type: String,
        enum: ['COD', 'UPI', 'CARD'],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    loyaltyPointsEarned: {
        type: Number,
        default: 0 // Points earned from this order
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false });

module.exports = mongoose.model("Order", orderSchema);
