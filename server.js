const express = require('express');
const path =  require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());


const TaskRouter = require('./routes/task.routes.js');
app.set('views', path.join(path.resolve(), 'views'));

app.use(express.static(path.join(path.resolve(), 'public')));

app.use("/api/tasks", TaskRouter);
mongoose.connect('mongodb://localhost:27017/tasks').then(() => {
    app.listen(3000, () => {
        console.log('server running on port 3000');
    });
}).catch((error) => {
    console.log(`not connected . Error : ${error}`);
})

