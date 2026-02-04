const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required'
            },
            len: {
                args: [2, 50],
                msg: 'Name must be between 2 and 50 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6],
                msg: 'Password must be at least 6 characters'
            }
        }
    },
    type: {
        type: DataTypes.ENUM('restaurant', 'cafe', 'bar', 'lounge', 'pub', 'hotel', 'club'),
        defaultValue: 'restaurant'
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Address is required'
            }
        }
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Phone is required'
            }
        }
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    reviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    openingTime: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Opening time is required'
            }
        }
    },
    closingTime: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Closing time is required'
            }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'restaurants',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

module.exports = Restaurant;
