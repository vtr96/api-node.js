const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const projectService = require('../services/projectService');
const taskService = require('../services/taskService');
const isAdmin = require('../middleware/isAdminMiddleware');

// Rota para popular a base com dados fictícios
router.post('/seed', isAdmin, async (req, res, next) => {
    try {
        // Usuários fictícios
        const users = [
            { username: 'user1', password: 'password1' },
            { username: 'user2', password: 'password2' },
        ];


        const createdUsers = await Promise.all(users.map(userService.addUser));

        // Adiciona projetos e tarefas para cada usuário fictício
        for (const user of createdUsers) {
            const project = await projectService.addProject(user.id, {
                name: `Projeto de ${user.username}`,
                description: `Descrição do projeto de ${user.username}`,
            });
            await taskService.addTask(user.id, {
                title: `Tarefa do ${user.username}`,
                status: 'pendente',
                projectId: project.id,
            });
        }

        res.status(201).json({ message: 'Base de dados populada com sucesso.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
