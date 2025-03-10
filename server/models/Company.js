const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Company', companySchema);
