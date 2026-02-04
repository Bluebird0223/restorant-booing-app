const { sequelize } = require('../config/database');
const User = require('./User');
const Restaurant = require('./Restaurant');
const Table = require('./Table');
const Reservation = require('./Reservation');

// Relationships
Restaurant.hasMany(Table, { foreignKey: 'restaurantId' });
Table.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Restaurant.hasMany(Reservation, { foreignKey: 'restaurantId' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Table.hasMany(Reservation, { foreignKey: 'tableId' });
Reservation.belongsTo(Table, { foreignKey: 'tableId' });

User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Table,
  Reservation
};
