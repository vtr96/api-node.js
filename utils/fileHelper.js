const fs = require('fs').promises;
const path = require('path');

const readJSONFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo: ${filePath}`, error);
        throw new Error('Falha na leitura do arquivo JSON');
    }
};

const writeJSONFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Erro ao escrever no arquivo: ${filePath}`, error);
        throw new Error('Falha na escrita do arquivo JSON');
    }
};

module.exports = {
    readJSONFile,
    writeJSONFile
};