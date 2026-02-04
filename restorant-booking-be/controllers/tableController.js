const Table = require('../models/Table');

exports.createTable = async (req, res) => {
    try {
        const { name, capacity } = req.body;

        if (!name || !capacity) {
            return res.status(400).json({ message: 'Name and capacity are required' });
        }

        if (capacity > 20 || capacity < 1) {
            return res.status(400).json({ message: 'Capacity must be between 1 and 20' });
        }

        // check if table already exists
        const existingTable = await Table.findOne({
            where: {
                restaurantId: req.restaurant.id,
                name
            }
        });

        if (existingTable) {
            return res.status(400).json({ message: 'Table already exists' });
        }

        const table = await Table.create({
            restaurantId: req.restaurant.id,
            name,
            capacity
        });

        res.status(201).json(table);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getTables = async (req, res) => {
    const tables = await Table.findAll({
        where: {
            restaurantId: req.restaurant.id,
            isActive: true
        }
    });

    res.json(tables);
};

exports.updateTable = async (req, res) => {
    const { id } = req.params;
    const { name, capacity } = req.body;

    const table = await Table.findOne({
        where: {
            id,
            restaurantId: req.restaurant.id
        }
    });

    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }

    await table.update({ name, capacity });
    res.json(table);
};

exports.deleteTable = async (req, res) => {
    const { id } = req.params;

    const table = await Table.findOne({
        where: {
            id,
            restaurantId: req.restaurant.id
        }
    });

    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }

    // Soft delete
    await table.update({ isActive: false });

    res.json({ message: 'Table removed successfully' });
};
