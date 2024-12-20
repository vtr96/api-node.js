const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const { generateId } = require('../utils/idGenerator');
const path = require('path');
const {isNumeric} = require("../utils/customs");

const PROJECTS_FILE = path.join(__dirname, '..', 'data', 'projects.json');

const ALLOWED_FIELDS = ['name', 'description'];

const validatePayload = (payload) => {
    const invalidFields = Object.keys(payload).filter(
        (key) => !ALLOWED_FIELDS.includes(key)
    );
    if (invalidFields.length > 0) {
        throw new Error(`Os seguintes campos não são permitidos: ${invalidFields.join(', ')}`);
    }
};

const isNameDuplicate = async (name, ignoreId = null) => {
    const projects = await readJSONFile(PROJECTS_FILE);
    return projects.some((project) => project.name === name && project.id !== ignoreId);
};

const addProject = async (project) => {
    validatePayload(project);

    if (!project.name || !project.description) {
        throw new Error('Os campos "name" e "description" são obrigatórios.');
    }
    if (typeof project.name !== 'string' || project.name.trim() === '') {
        throw new Error('O campo "name" deve ser uma string não vazia.');
    }
    if (typeof project.description !== 'string' || project.description.trim() === '') {
        throw new Error('O campo "description" deve ser uma string não vazia.');
    }
    if (await isNameDuplicate(project.name)) {
        throw new Error(`O nome "${project.name}" já está em uso.`);
    }

    const projects = await readJSONFile(PROJECTS_FILE);

    project.id = generateProjectId();

    projects.push(project);
    await writeJSONFile(PROJECTS_FILE, projects);
    return project;
};


const updateProject = async (projectId, updatedData) => {
    validatePayload(updatedData);

    if (!isNumeric(projectId)) {
        throw new Error('O id do projeto deve ser numérico.')
    }
    projectId = parseInt(projectId, 10);
    const projects = await readJSONFile(PROJECTS_FILE);
    const projectIndex = projects.findIndex((project) => project.id === projectId);

    if (projectIndex === -1) {
        throw new Error('Projeto não encontrado.');
    }

    if (updatedData.name && await isNameDuplicate(updatedData.name, projectId)) {
        throw new Error(`O nome "${updatedData.name}" já está em uso.`);
    }

    projects[projectIndex] = { ...projects[projectIndex], ...updatedData };
    await writeJSONFile(PROJECTS_FILE, projects);

    return projects[projectIndex];
};

const getProjects = async () => {
    return await readJSONFile(PROJECTS_FILE);
};

let lastProjectId = 0;

const initializeLastProjectId = async () => {
    const projects = await readJSONFile(PROJECTS_FILE);
    if (projects.length > 0) {
        lastProjectId = Math.max(...projects.map((project) => project.id));
    }
};

const generateProjectId = () => {
    lastProjectId += 1;
    return lastProjectId;
};

initializeLastProjectId();

module.exports = {
    getProjects,
    addProject,
    updateProject
};