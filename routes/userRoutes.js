const express = require('express');
const { validationResult } = require('express-validator');
const { validateUserRegistration, validateUserLogin } = require('../validators/userValidators');
const router = express.Router();
const userService = require('../services/userService');
const { generateToken } = require('../utils/jwtHelper');
const bcrypt = require('bcrypt');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Registro de Usuário
router.post(
    '/register',
    [...validateUserRegistration, validateRequest],
    async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const user = await userService.addUser({ username, password });
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
);

// Login de Usuário
router.post(
    '/login',
    [...validateUserLogin, validateRequest],
    async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const user = await userService.getUserByUsername(username);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error('Credenciais inválidas.');
            }

            const token = generateToken(user.id);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;