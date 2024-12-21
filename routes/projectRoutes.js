const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();
const projectService = require('../services/projectService');

router.use(authenticate);

// Listar projetos
router.get('/', async (req, res, next) => {
    try {
        const projects = await projectService.getProjectsByUser(req.user.id);
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// Adicionar projeto
router.post('/', async (req, res, next) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            throw new Error('Payload inválido. Um objeto com os campos "name" e "description" é esperado.');
        }
        const project = await projectService.addProject(req.user.id, req.body);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
});

// Deletar projeto
router.delete('/:id', async (req, res, next) => {
    try {
        const projectId = req.params.id;
        await projectService.deleteProject(req.user.id, parseInt(projectId, 10));
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

// Atualizar projeto
router.put('/:id', async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const updatedProject = await projectService.updateProject(projectId, req.body);
        res.json(updatedProject);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
