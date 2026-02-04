const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
  process.env.DB_CONNECTION_URL,
  {
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🐘 PostgreSQL Connected successfully');
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }
    return sequelize;
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDatabase, sequelize };
