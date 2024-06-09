const express = require('express');
const router = express.Router();
const {getTasks, createTask, getTask, updateTask, deleteTask} = require('../controllers/task.controller');

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);



module.exports = router;