const express = require('express');
const { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, login, getAllRestaurants } = require('../controllers/restaurantController');


const RestaurantRouter = express.Router();

RestaurantRouter.post('/register', createRestaurant);
RestaurantRouter.get('/', getRestaurants);
RestaurantRouter.get('/all', getAllRestaurants);
RestaurantRouter.get('/:id', getRestaurantById);
RestaurantRouter.put('/:id', updateRestaurant);
RestaurantRouter.delete('/:id', deleteRestaurant);
RestaurantRouter.post('/login', login);

module.exports = RestaurantRouter;
