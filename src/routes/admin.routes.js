import express from 'express';
import { param, body, query } from 'express-validator';
import {
    getEnemigos, setEnemigos, updateEnemigos, deleteEnemigos,
    getUsuarios, setUsuarios, deleteUsuarios,
    getHistorialPeleas,
    getUsuariosById,
    newAdmin
} from '../controllers/admin.controller.js';

import { validarToken } from '../middlewares/validateTokens.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validateInputs } from '../middlewares/validateImputs.js';

const router = express.Router();

router.use(validarToken, validarRol('admin'));

router.get('/enemigos', [
    query('id').optional().isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], getEnemigos)
router.post('/enemigos', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('vida').isInt({ min: 1 }).withMessage('La vida debe ser un número entero positivo'),
    body('ataque').isInt({ min: 1 }).withMessage('El ataque debe ser un número entero positivo'),
    body('defensa').isInt({ min: 1 }).withMessage('La defensa debe ser un número entero positivo'),
    body('velocidad').isInt({ min: 1 }).withMessage('La velocidad debe ser un número entero positivo'),
    body('tipo').isIn(['boss', 'normal']).withMessage('El tipo debe ser boss o normal'),
    validateInputs
], setEnemigos)
router.patch('/enemigos', [
    body('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], updateEnemigos)
router.delete('/enemigos', [
    body('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], deleteEnemigos)

router.get('/usuarios', getUsuarios)
router.get('/usuarios/:id', [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], getUsuariosById)
router.patch('/usuarios/:id', [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], setUsuarios)
router.delete('/usuarios/:id', [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], deleteUsuarios)

router.get('/historial', getHistorialPeleas)
router.post('/nuevoAdmin', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    validateInputs
], newAdmin)

export { router }
