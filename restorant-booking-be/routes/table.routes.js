const express = require('express');
const { createTable, getTables, updateTable, deleteTable } = require('../controllers/tableController');


const tableRouter = express.Router();

tableRouter.post('/', createTable);
tableRouter.get('/', getTables);
tableRouter.put('/:id', updateTable);
tableRouter.delete('/:id', deleteTable);

module.exports = tableRouter;
