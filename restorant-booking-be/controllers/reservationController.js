const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const redis = require('../config/redis');


exports.getAvailability = async (req, res) => {
    const { id } = req.params;
    const { date, guests } = req.query;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const opening = new Date(`${date} ${restaurant.openingTime}`);
    const closing = new Date(`${date} ${restaurant.closingTime}`);

    const slots = generateSlots(opening, closing);

    const tables = await Table.findAll({
        where: {
            restaurantId: id,
            capacity: { [Op.gte]: guests },
            isActive: true
        }
    });

    const availability = [];

    for (const slot of slots) {
        const reservations = await Reservation.count({
            where: {
                restaurantId: id,
                tableId: tables.map(t => t.id),
                status: 'confirmed',
                [Op.or]: [
                    {
                        startTime: { [Op.lt]: slot.end },
                        endTime: { [Op.gt]: slot.start }
                    }
                ]
            }
        });

        if (reservations < tables.length) {
            availability.push(slot.start);
        }
    }

    res.json({ availableSlots: availability });
};

exports.createReservation = async (req, res) => {
    const { restaurantId, guestCount, startTime } = req.body;
    const userId = req.user.id;

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    const tables = await Table.findAll({
        where: {
            restaurantId,
            capacity: { [Op.gte]: guestCount },
            isActive: true
        }
    });

    if (!tables.length) {
        return res.status(400).json({ message: 'No suitable tables' });
    }

    for (const table of tables) {
        const lockKey = `lock:table:${table.id}:time:${startTime}`;

        // Attempt to acquire lock for 30 seconds
        const locked = await redis.set(lockKey, 'locked', 'EX', 30, 'NX');
        if (!locked) continue;

        try {
            const existing = await Reservation.findOne({
                where: {
                    tableId: table.id,
                    status: 'confirmed',
                    startTime: { [Op.lt]: endTime },
                    endTime: { [Op.gt]: startTime }
                }
            });

            if (existing) {
                await redis.del(lockKey);
                continue;
            }

            const reservation = await Reservation.create({
                restaurantId,
                tableId: table.id,
                userId,
                guestCount,
                startTime,
                endTime,
                status: 'confirmed'
            });

            // Keep the lock until the reservation is created or fails
            // In a more complex system, we might release it or keep it to prevent immediate re-booking
            await redis.del(lockKey);

            return res.status(201).json(reservation);
        } catch (error) {
            await redis.del(lockKey);
            throw error;
        }
    }

    res.status(409).json({ message: 'No available tables for this slot' });
};

exports.cancelReservation = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (reservation.status !== 'confirmed') {
        return res.status(400).json({ message: 'Reservation cannot be cancelled' });
    }

    const now = new Date();
    if (now >= reservation.startTime) {
        return res.status(400).json({ message: 'Too late to cancel' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation cancelled successfully' });
};

exports.getRestaurantReservations = async (req, res) => {
    try {
        const restaurantId = req.restaurant.id;
        const reservations = await Reservation.findAll({
            where: { restaurantId },
            include: [
                { model: Table, attributes: ['name', 'capacity'] },
                { model: User, attributes: ['name', 'email'] }
            ],
            order: [['startTime', 'ASC']]
        });

        res.json(reservations);
    } catch (error) {
        console.error('Get restaurant reservations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateReservationStatus = async (req, res) => {
    try {
        const { id, type } = req.params;
        const restaurantId = req.restaurant.id;

        const reservation = await Reservation.findOne({
            where: { id, restaurantId }
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const statusMap = {
            'accept': 'accepted',
            'reject': 'rejected',
            'no-show': 'no-show',
            'confirm': 'confirmed',
            'cancel': 'cancelled'
        };

        const newStatus = statusMap[type];
        if (!newStatus) {
            return res.status(400).json({ message: 'Invalid action type' });
        }

        reservation.status = newStatus;
        await reservation.save();

        res.json({ message: `Reservation ${newStatus} successfully`, reservation });
    } catch (error) {
        console.error('Update reservation status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
