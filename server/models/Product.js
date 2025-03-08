const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String },

    // Ratings & reviews
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    // Loyalty points for purchases
    loyaltyPoints: { type: Number, default: 0 },

    // Analytics: tracking interactions
    viewCount: { type: Number, default: 0 },
    addToCartCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
