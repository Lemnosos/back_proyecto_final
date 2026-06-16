import express from 'express';
import { body } from 'express-validator';
import { createUser, loginUser, renewToken, logoutUser } from '../controllers/auth.controllers.js';
import { validarToken } from '../middlewares/validateTokens.js';
import { validateInputs } from '../middlewares/validateImputs.js';

const router = express.Router();

router.post('/new', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateInputs
], createUser)

router.post('/', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validateInputs
], loginUser)

router.get('/renew', validarToken, renewToken)

router.post('/logout', logoutUser)

export { router }
