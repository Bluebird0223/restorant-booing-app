const express = require('express');
const { getAvailability, createReservation, cancelReservation, getRestaurantReservations, updateReservationStatus } = require('../controllers/reservationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/availability/:id', getAvailability);
router.post('/', auth, createReservation);
router.delete('/:id', auth, cancelReservation);

// Dashboard routes for restaurants
router.get('/restaurant', auth, getRestaurantReservations);
router.post('/restaurant/:id/:type', auth, updateReservationStatus);

module.exports = router;
