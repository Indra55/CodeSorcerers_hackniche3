const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  link: { type: String },
  search_query: { type: String },
  image_url: { type: String },
  description: { type: String },
  availability: { type: Number, default: 0 },
  loyaltypoints: { type: Number, default: 0 },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
