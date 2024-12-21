const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const { generateTaskId } = require('../utils/idGenerator');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '../data/tasks.json');
const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');

const isProjectValid = async (projectId, userId) => {
    const projects = await readJSONFile(PROJECTS_FILE);
    return projects.some((project) => project.id === projectId && project.userId === userId);
};

const getTasks = async (projectId = null) => {
    const tasks = await readJSONFile(TASKS_FILE);
    if (projectId) {
        return tasks.filter((task) => task.projectId === projectId);
    }
    return tasks;
};

const getTasksByUser = async (userId) => {
    const tasks = await readJSONFile(TASKS_FILE);
    return tasks.filter((task) => task.userId === userId);
};

const addTask = async (userId, task) => {
    if (!task.title || !task.status) {
        throw new Error('Os campos "title" e "status" são obrigatórios.');
    }

    if (!(await isProjectValid(task.projectId, userId))) {
        throw new Error('Projeto não pertence ao usuário.');
    }

    const tasks = await readJSONFile(TASKS_FILE);

    task.id = generateTaskId(tasks);
    task.userId = userId;
    tasks.push(task);

    await writeJSONFile(TASKS_FILE, tasks);
    return task;
};

// Atualiza uma tarefa do usuário autenticado
const updateTask = async (userId, taskId, updatedData) => {
    const tasks = await readJSONFile(TASKS_FILE);
    const taskIndex = tasks.findIndex(
        (task) => task.id === taskId && task.userId === userId
    );

    if (taskIndex === -1) {
        throw new Error('Tarefa não encontrada ou não pertence ao usuário.');
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
    await writeJSONFile(TASKS_FILE, tasks);

    return tasks[taskIndex];
};

// Remove uma tarefa do usuário autenticado
const deleteTask = async (userId, taskId) => {
    const tasks = await readJSONFile(TASKS_FILE);
    const updatedTasks = tasks.filter(
        (task) => !(task.id === taskId && task.userId === userId)
    );

    if (tasks.length === updatedTasks.length) {
        throw new Error('Tarefa não encontrada ou não pertence ao usuário.');
    }

    await writeJSONFile(TASKS_FILE, updatedTasks);
};

module.exports = {
    getTasks,
    getTasksByUser,
    addTask,
    updateTask,
    deleteTask,
};