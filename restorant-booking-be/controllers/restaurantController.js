
const Restaurant = require('../models/Restaurant');
const generateToken = require('../utils/generateToken');
const restaurantSchema = require('../utils/restaurantValidation');
const bcrypt = require('bcrypt');

const createRestaurant = async (req, res) => {
    try {
        const { name, email, password, type, address, phone, rating, reviews, images, openingTime, closingTime } = req.body;
        const validationResult = restaurantSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request',
                errors: validationResult.error.errors
            });
        }
        // check if restaurant with same email already exists
        const existingRestaurant = await Restaurant.findOne({ where: { email } });
        if (existingRestaurant) {
            return res.status(400).json({
                success: false,
                message: 'Restaurant with this email already exists'
            });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const dataToCreate = {
            name: name,
            email: email,
            password: hashedPassword,
            type: type,
            address: address,
            phone: phone,
            rating: Number(rating) || 0,
            reviews: Number(reviews) || 0,
            images: images,
            openingTime: openingTime,
            closingTime: closingTime,
        }
        const restaurant = await Restaurant.create(dataToCreate);
        console.log(`Restaurant created: ${restaurant.email}`);
        res.status(201).json({
            success: true,
            message: 'Restaurant created successfully',
        });
    } catch (error) {
        console.error('Create restaurant error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({});
        if (!restaurants) {
            return res.status(404).json({
                success: false,
                message: 'Restaurants not found'
            });
        }
        res.json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (error) {
        console.error('Get restaurants error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        res.json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        console.error('Get restaurant by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        console.log(`Restaurant updated: ${restaurant.email}`);
        res.json({
            success: true,
            message: 'Restaurant updated successfully',
            data: restaurant
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        console.log(`Restaurant deleted: ${restaurant.email}`);
        res.json({
            success: true,
            message: 'Restaurant deleted successfully'
        });
    } catch (error) {
        console.error('Delete restaurant error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const restaurant = await Restaurant.findOne({ where: { email } });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, restaurant.password);
        const token = generateToken(restaurant);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }
        console.log(`Restaurant logged in: ${restaurant.email}`);
        res.json({
            success: true,
            message: 'Restaurant logged in successfully',
            data: { restaurant, token }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, login };
