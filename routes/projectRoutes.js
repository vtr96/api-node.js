const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');

// Listar projetos
router.get('/', async (req, res) => {
    try {
        const projects = await projectService.getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Adicionar projeto
router.post('/', async (req, res) => {
    try {
        const project = await projectService.addProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar projeto
router.put('/:id', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const updatedProject = await projectService.updateProject(projectId, req.body);
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ error: error.message }); // Retorna erro de validação
    }
});

module.exports = router;
