const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
}, { timestamps: true });  // Added timestamps for createdAt and updatedAt

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { id: this._id },
        process.env.JWTKEY,
        { expiresIn: '7d' }
    );
    return token;
};

const User = mongoose.model('User', userSchema);

const validate = (data) => {
    const schema = joi.object({
        firstName: joi.string().min(2).max(50).required().label('First Name'),
        lastName: joi.string().min(2).max(50).required().label('Last Name'),
        email: joi.string().email().required().label('Email'),
        password: passwordComplexity().required().label('Password')
    });
    return schema.validate(data);
};

module.exports = { User, validate };
