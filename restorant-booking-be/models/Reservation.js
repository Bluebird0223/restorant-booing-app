const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    restaurantId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    tableId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    guestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'accepted', 'rejected', 'no-show'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'reservations',
    timestamps: true,
    indexes: [
        { fields: ['restaurantId', 'startTime'] },
        { fields: ['tableId', 'startTime'] }
    ]
});

module.exports = Reservation;
