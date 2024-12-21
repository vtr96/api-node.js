const { check } = require('express-validator');

const validateUserRegistration = [
    check('username')
        .notEmpty().withMessage('O campo "username" é obrigatório.')
        .isLength({ min: 3 }).withMessage('O campo "username" deve ter pelo menos 3 caracteres.')
        .matches(/^\w+$/).withMessage('O campo "username" deve conter apenas letras, números e underline.'),
    check('password')
        .notEmpty().withMessage('O campo "password" é obrigatório.')
        .isLength({ min: 6 }).withMessage('O campo "password" deve ter pelo menos 6 caracteres.')
];

const validateUserLogin = [
    check('username')
        .notEmpty().withMessage('O campo "username" é obrigatório.'),
    check('password')
        .notEmpty().withMessage('O campo "password" é obrigatório.')
];

module.exports = {
    validateUserRegistration,
    validateUserLogin
};
