const generateId = (items) => {
    if (!Array.isArray(items)) throw new Error('A lista fornecida não é válida.');
    const lastItem = items[items.length - 1];
    return lastItem ? lastItem.id + 1 : 1;
};

const generateTaskId = (tasks) => {
    if (!Array.isArray(tasks)) throw new Error('A lista de tarefas não é válida.');
    const lastTask = tasks[tasks.length - 1];
    return lastTask ? lastTask.id + 1 : 1; // Retorna 1 se não houver tarefas
};

module.exports = { generateId, generateTaskId };