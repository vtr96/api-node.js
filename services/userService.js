const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const bcrypt = require('bcrypt');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

const getUsers = async () => {
    return await readJSONFile(USERS_FILE);
};

const getUserByUsername = async (username) => {
    const users = await getUsers();
    return users.find((user) => user.username === username);
};

const addUser = async (user) => {
    const users = await getUsers();

    if (users.some((u) => u.username === user.username)) {
        const error = new Error('O nome de usuário já está em uso.');
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    user.password = hashedPassword;
    users.push(user);

    await writeJSONFile(USERS_FILE, users);
    return { id: user.id, username: user.username };
};

module.exports = {
    getUsers,
    getUserByUsername,
    addUser
};