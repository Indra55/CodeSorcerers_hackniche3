const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user, items, address, paymentMode } = req.body;

        // Calculate total and loyalty points
        let total = 0;
        let totalLoyaltyPoints = 0;

        // Get all product IDs
        const productIds = items.map(item => item.product);

        // Fetch all products in one query with explicit field selection
        const products = await Product.find(
            { _id: { $in: productIds } },
            'price loyaltypoints' // Explicitly select these fields
        );

        console.log('Found products:', products); // Debug log

        // Create a map for quick product lookup
        const productMap = products.reduce((map, product) => {
            map[product._id.toString()] = product;
            return map;
        }, {});

        // Calculate totals and points
        items.forEach(item => {
            const product = productMap[item.product.toString()];
            if (product) {
                total += product.price * item.quantity;
                // Debug log
                console.log(`Product ${product._id} - Price: ${product.price}, Loyalty Points: ${product.loyaltypoints}, Quantity: ${item.quantity}`);
                totalLoyaltyPoints += (product.loyaltypoints || 0) * item.quantity;
            }
        });

        // Debug log
        console.log('Total loyalty points calculated:', totalLoyaltyPoints);

        // Create order with calculated values
        const created = new Order({
            user,
            items,
            address,
            paymentMode,
            total,
            loyaltyPointsEarned: totalLoyaltyPoints
        });
        
        await created.save({ session });

        // Update user's loyalty points
        await User.findByIdAndUpdate(
            user, 
            { $inc: { loyaltyPoints: totalLoyaltyPoints } }, 
            { session }
        );

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Populate the order with product details before sending response
        const populatedOrder = await Order.findById(created._id)
            .populate({
                path: 'items.product',
                select: 'name price image_url loyaltypoints' // Include loyaltypoints in populate
            });

        res.status(201).json({
            order: populatedOrder,
            loyaltyPointsEarned: totalLoyaltyPoints,
            newTotalPoints: (await User.findById(user)).loyaltyPoints
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Order creation error:', error);
        return res.status(500).json({ 
            message: 'Error creating order, please try again later',
            error: error.message 
        });
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
