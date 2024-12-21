const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const { generateId } = require('../utils/idGenerator');
const path = require('path');
const {isNumeric} = require("../utils/customs");

const PROJECTS_FILE = path.join(__dirname, '..', 'data', 'projects.json');
const TASKS_FILE = path.join(__dirname, '../data/tasks.json');

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

const addProject = async (userId, project) => {
    validatePayload(project);

    if (!project || typeof project !== 'object') {
        throw new Error('Payload inválido. Um objeto com os campos "name" e "description" é esperado.');
    }
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
    project.userId = userId;
    projects.push(project);

    await writeJSONFile(PROJECTS_FILE, projects);
    return project;
};


const updateProject = async (userId, projectId, updatedData) => {
    validatePayload(updatedData);

    if (!isNumeric(projectId)) {
        throw new Error('O id do projeto deve ser numérico.');
    }

    const projects = await readJSONFile(PROJECTS_FILE);
    const projectIndex = projects.findIndex(
        (project) => project.id === parseInt(projectId, 10) && project.userId === userId
    );

    if (projectIndex === -1) {
        throw new Error('Projeto não pertence ao usuário.');
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

const getProjectsByUser = async (userId) => {
    const projects = await readJSONFile(PROJECTS_FILE);
    return projects.filter((project) => project.userId === userId);
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

const deleteProject = async (userId, projectId) => {
    const projects = await readJSONFile(PROJECTS_FILE);
    const projectIndex = projects.findIndex(
        (project) => project.id === parseInt(projectId, 10) && project.userId === userId
    );

    if (projectIndex === -1) {
        throw new Error('Projeto não pertence ao usuário.');
    }

    const deletedProject = projects[projectIndex];
    const updatedProjects = projects.filter(
        (project) => project.id !== parseInt(projectId, 10)
    );

    const tasks = await readJSONFile(TASKS_FILE);
    const updatedTasks = tasks.filter(
        (task) => task.projectId !== parseInt(projectId, 10)
    );
    await writeJSONFile(TASKS_FILE, updatedTasks);

    await writeJSONFile(PROJECTS_FILE, updatedProjects);

    return deletedProject;
};

module.exports = {
    getProjects,
    getProjectsByUser,
    addProject,
    deleteProject,
    updateProject
};