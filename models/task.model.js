const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'todo'
    }
}, {
    timestamps: true
});

const Task = mongoose.model('task', taskSchema);
module.exports = Task;