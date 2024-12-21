const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const bcrypt = require('bcrypt');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

const getUsers = async () => {
    return await readJSONFile(USERS_FILE);
};

const getUserById = async (userId) => {
    const users = await getUsers();
    return users.find((user) => user.id === userId);
};

const getUserByUsername = async (username) => {
    const users = await getUsers();
    return users.find((user) => user.username === username);
};

const addUser = async (user) => {
    const users = await getUsers();

    if (users.some((u) => u.username === user.username)) {
        throw new Error('O nome de usuário já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    user.password = hashedPassword;
    user.isAdmin = user.isAdmin || false;
    users.push(user);

    await writeJSONFile(USERS_FILE, users);
    return { id: user.id, username: user.username, isAdmin: user.isAdmin };
};

const updateUser = async (userId, updatedData) => {
    const users = await getUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        throw new Error('Usuário não encontrado.');
    }

    if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    users[userIndex] = { ...users[userIndex], ...updatedData };
    await writeJSONFile(USERS_FILE, users);

    return { id: users[userIndex].id, username: users[userIndex].username, isAdmin: users[userIndex].isAdmin };
};

const deleteUser = async (userId) => {
    const users = await getUsers();
    const updatedUsers = users.filter((user) => user.id !== userId);

    if (users.length === updatedUsers.length) {
        throw new Error('Usuário não encontrado.');
    }

    await writeJSONFile(USERS_FILE, updatedUsers);
};

module.exports = {
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUser,
    deleteUser,
};
