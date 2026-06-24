import express from 'express';
import { body } from 'express-validator';
import { createUser, loginUser, deleteToken } from '../controllers/auth.controllers.js';
import { validarToken } from '../middlewares/validateTokens.js';
import { validateInputs } from '../middlewares/validateImputs.js';

const router = express.Router();

/**
 * Middleware condicional: valida token solo si el body pide rol admin.
 */
const validateIfAdmin = (req, res, next) => {
    if (req.body.rol === 'admin') {
        return validarToken(req, res, () => {
            if (req.rol !== 'admin') {
                return res.status(403).json({ ok: false, error: 'No autorizado para crear administradores' })
            }
            next()
        })
    }
    next()
}

router.post('/new', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').optional().isIn(['user', 'admin']).withMessage('El rol debe ser user o admin'),
    validateInputs,
    validateIfAdmin
], createUser)

router.post('/', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validateInputs
], loginUser)

router.get('/delete', deleteToken)

export { router }
