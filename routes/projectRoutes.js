const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');

// Listar projetos
router.get('/', async (req, res, next) => {
    try {
        const projects = await projectService.getProjects();
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// Adicionar projeto
router.post('/', async (req, res, next) => {
    try {
        const project = await projectService.addProject(req.body);
        res.status(201).json(project);
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
