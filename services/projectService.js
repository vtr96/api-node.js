const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const { generateId } = require('../utils/idGenerator');
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, '..', 'data', 'projects.json');

const getProjects = async () => {
    return await readJSONFile(PROJECTS_FILE);
};

const addProject = async (project) => {
    const projects = await readJSONFile(PROJECTS_FILE);
    project.id = generateId(projects);
    projects.push(project);
    await writeJSONFile(PROJECTS_FILE, projects);
    return project;
};

module.exports = {
    getProjects,
    addProject
};