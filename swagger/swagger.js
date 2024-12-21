const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./app.js'];

const doc = {
    info: {
        title: 'API Documentation',
        description: 'Documentação da API para gerenciamento de projetos e tarefas',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    definitions: {
        Project: {
            name: 'Exemplo de Projeto',
            description: 'Descrição do Projeto',
        },
        Task: {
            title: 'Exemplo de Tarefa',
            status: 'pendente',
            projectId: 1,
        },
        User: {
            username: 'admin',
            password: '123456',
        },
    },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger JSON gerado com sucesso!');
});
