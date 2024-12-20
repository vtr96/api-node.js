const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');


app.use(express.json());

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.get('/index', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

app.listen((PORT), () => {
    console.log(`Listening on port ${PORT}`);
});