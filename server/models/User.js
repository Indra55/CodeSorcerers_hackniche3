const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // Role management: customer, business, admin
    role: { type: String, enum: ["customer", "business", "admin"], default: "customer" },

    // Loyalty program: Track points
    loyaltyPoints: { type: Number, default: 0 },

    // Purchase history for recommendations
    purchaseHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],

    // Browsing behavior tracking
    viewedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    cartHistory: [{ type: Schema.Types.ObjectId, ref: "Cart" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
