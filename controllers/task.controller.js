const TaskModel = require('../models/task.model');

const getTasks = async (req, res) => {
    try {
        const { search, status } = req.query;
        let filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) filter.status = status;

        const tasks = await TaskModel.find(filter);
        res.json(tasks);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getTask = async (req, res) => {
    const task = await TaskModel.findById(req.params.id);
    if (!task) {
        res.status(404).send({error: 'Task not found'});
    }
    res.json(task);
}

const createTask = async (req, res) => {
    console.log(req.body);
    try {
        const task = await TaskModel.create(req.body);
        const data = {'task': task};
        res.json(data);
    } catch (error) {
        res.status(400).send({error: error.message});
    }
}

const updateTask = async (req, res) => {
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body);
    if (!task) {
        res.status(404).send({error: 'Task not found'});
    }
    res.json({message: 'Task updated successfully.'});
}

const deleteTask = async (req, res) => {
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    if (!task) {
        res.status(404).send({error: 'Task not found'});
    }
    res.json({message: 'Task deleted successfully.'});
}

module.exports = {
    getTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}