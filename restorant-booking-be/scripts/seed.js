require('dotenv').config();

async function seed() {
    try {
        console.log('DB_URL:', process.env.DB_CONNECTION_URL);

        // Import models inside try block to catch import errors
        const { User, Restaurant, Table, sequelize } = require('../models');
        const bcrypt = require('bcryptjs');

        // Sync models
        await sequelize.sync({ force: false });
        console.log('Database synced');

        // 1. Create a User
        const hashedPassword = await bcrypt.hash('password123', 10);
        const [user] = await User.findOrCreate({
            where: { email: 'testuser@example.com' },
            defaults: {
                name: 'Test User',
                password: hashedPassword
            }
        });
        console.log('User seeded:', user.email);

        // 2. Create a Restaurant
        const [restaurant] = await Restaurant.findOrCreate({
            where: { email: 'testrest@example.com' },
            defaults: {
                name: 'The Great Bistro',
                password: hashedPassword,
                type: 'restaurant',
                address: '123 Food Street',
                phone: '1234567890',
                openingTime: '09:00',
                closingTime: '22:00',
                rating: 4.5,
                reviews: 10
            }
        });
        console.log('Restaurant seeded:', restaurant.email);

        // 3. Create Tables
        const tableData = [
            { name: 'Table 1', capacity: 2, restaurantId: restaurant.id },
            { name: 'Table 2', capacity: 4, restaurantId: restaurant.id },
            { name: 'Table 3', capacity: 6, restaurantId: restaurant.id }
        ];

        for (const t of tableData) {
            const [table] = await Table.findOrCreate({
                where: { name: t.name, restaurantId: t.restaurantId },
                defaults: t
            });
            console.log('Table seeded:', table.name);
        }

        console.log('✅ Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
