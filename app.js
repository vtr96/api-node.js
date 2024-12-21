const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const userService = require('./services/userService');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

//Special operation - POST /special/seed
const specialRoutes = require('./routes/specialRoutes');
app.use('/special', specialRoutes);

app.get('/install', async (req, res, next) => {
    try {
        const adminExists = (await userService.getUsers()).some((user) => user.isAdmin);
        if (adminExists) {
            return res.status(400).json({ error: 'Administrador já existe.' });
        }

        const admin = await userService.addUser({
            username: 'admin',
            password: 'admin123',
            isAdmin: true,
        });
        res.status(201).json({ message: 'Administrador criado com sucesso.', admin });
    } catch (error) {
        next(error);
    }
});


app.get('/index', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

app.listen((PORT), () => {
    console.log(`Listening on port ${PORT}`);
});