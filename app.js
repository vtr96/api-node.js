const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('././routes/userRoutes')
const errorHandler = require('./middleware/errorHandler');


app.use(express.json());

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.get('/index', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

app.listen((PORT), () => {
    console.log(`Listening on port ${PORT}`);
});