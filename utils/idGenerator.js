const generateId = (items) => {
    if (!Array.isArray(items)) throw new Error('A lista fornecida não é válida.');
    const lastItem = items[items.length - 1];
    return lastItem ? lastItem.id + 1 : 1; // Retorna 1 se a lista estiver vazia
};

module.exports = { generateId };