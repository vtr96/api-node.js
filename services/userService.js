const { readJSONFile, writeJSONFile } = require('../utils/fileHelper');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

const getUsers = async () => {
    return await readJSONFile(USERS_FILE);
};

const addUser = async (user) => {
    const users = await readJSONFile(USERS_FILE);
    users.push(user);
    await writeJSONFile(USERS_FILE, users);
    return user;
};

module.exports = {
    getUsers,
    addUser
};