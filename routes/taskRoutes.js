const express = require('express');
const taskService = require('../services/taskService');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
    try {
        const tasks = await taskService.getTasksByUser(req.user.id);
        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const task = await taskService.addTask(req.user.id, req.body);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.user.id, parseInt(req.params.id), req.body);
        res.json(task);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await taskService.deleteTask(req.user.id, parseInt(req.params.id));
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;