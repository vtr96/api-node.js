const express = require('express');
const { validationResult } = require('express-validator');
const { validateUserRegistration, validateUserLogin } = require('../validators/userValidators');
const isAdmin = require('../middleware/isAdminMiddleware');
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

router.get('/', isAdmin, async (req, res, next) => {
    try {
        const users = await userService.getUsers();
        const sanitizedUsers = users.map(({ password, ...user }) => user);
        res.json(sanitizedUsers);
    } catch (error) {
        next(error);
    }
});

router.post('/admin', isAdmin, validateUserRegistration, validateRequest, async (req, res, next) => {
    try {
        const user = await userService.addUser({ ...req.body, isAdmin: true });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);

        if (req.user.id !== userId && !req.user.isAdmin) {
            throw new Error('Acesso negado. Você só pode alterar seus próprios dados.');
        }

        const updatedUser = await userService.updateUser(userId, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});


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

            const token = generateToken(user);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', isAdmin, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await userService.getUserById(userId);
        if (!user || user.isAdmin) {
            throw new Error('Usuário não encontrado ou é administrador.');
        }
        await userService.deleteUser(userId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;