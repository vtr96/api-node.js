const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const { generateId } = require('../utils/idGenerator');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '../data/tasks.json');
const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');

const isProjectValid = async (projectId) => {
    const projects = await readJSONFile(PROJECTS_FILE);
    return projects.some((project) => project.id === projectId);
};

const getTasks = async (projectId = null) => {
    const tasks = await readJSONFile(TASKS_FILE);
    if (projectId) {
        return tasks.filter((task) => task.projectId === projectId);
    }
    return tasks;
};

const addTask = async (task) => {
    if (!(await isProjectValid(task.projectId))) {
        throw new Error('Projeto não encontrado');
    }

    const tasks = await readJSONFile(TASKS_FILE);
    task.id = generateId(tasks);
    tasks.push(task);
    await writeJSONFile(TASKS_FILE, tasks);
    return task;
};

const updateTask = async (taskId, updatedData) => {
    const tasks = await readJSONFile(TASKS_FILE);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
        throw new Error('Tarefa não encontrada');
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
    await writeJSONFile(TASKS_FILE, tasks);

    return tasks[taskIndex];
};

const deleteTask = async (taskId) => {
    const tasks = await readJSONFile(TASKS_FILE);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    if (tasks.length === updatedTasks.length) {
        throw new Error('Tarefa não encontrada');
    }

    await writeJSONFile(TASKS_FILE, updatedTasks);
};

module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask
};