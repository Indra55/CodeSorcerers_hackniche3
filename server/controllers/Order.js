const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user, total } = req.body;

        // Create order
        const created = new Order(req.body);
        await created.save({ session });

        // Calculate loyalty points (1 point per $10 spent)
        const loyaltyPoints = Math.floor(total / 10);

        // Update user's loyalty points
        await User.findByIdAndUpdate(user, { $inc: { loyaltyPoints } }, { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ created, loyaltyPoints });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return res.status(500).json({ message: 'Error creating order, please try again later' });
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await Order.find({ user: id });
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching orders, please try again later' });
    }
};

exports.getAll = async (req, res) => {
    try {
        let skip = 0, limit = 0;

        if (req.query.page && req.query.limit) {
            const pageSize = req.query.limit;
            const page = req.query.page;
            skip = pageSize * (page - 1);
            limit = pageSize;
        }

        const totalDocs = await Order.countDocuments();
        const results = await Order.find().skip(skip).limit(limit);

        res.header("X-Total-Count", totalDocs);
        res.status(200).json(results);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders, please try again later' });
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Order.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating order, please try again later' });
    }
};
