const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true }, // Brand name of the product
  price: { type: Number, required: true }, // Price as a number
  rating: { type: Number, default: 0 }, // Rating as a number
  reviews: { type: Number, default: 0 }, // Number of reviews as an integer
  link: { type: String }, // Product URL link
  search_query: { type: String }, // Keywords associated with the product
  image_url: { type: String }, // URL of the product's image
  description: { type: String }, // Detailed description of the product
  availability: { type: Number, default: 0 }, // Availability as a number (e.g., stock count)
  loyaltypoints: { type: Number, default: 0 }, // Points for the loyalty program
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
