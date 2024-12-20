const errorHandler = (err, req, res, next) => {
    // Define o status padrão
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Ocorreu um erro interno no servidor.',
        code: err.code || 'SERVER_ERROR'
    });
};

module.exports = errorHandler;