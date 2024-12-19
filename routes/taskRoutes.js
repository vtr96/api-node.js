const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');

// Listar tarefas (opcionalmente por projeto)
router.get('/', async (req, res) => {
    try {
        const tasks = await taskService.getTasks(req.query.projectId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Adicionar tarefa
router.post('/', async (req, res) => {
    try {
        const task = await taskService.addTask(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
