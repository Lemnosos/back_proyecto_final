import express from 'express';
import { param, body } from 'express-validator';

import {
    getPersonaje, setPersonaje, updatePersonaje, deletePersonaje,
    getUsuarios, updateUsuario, deleteUsuario,
    getResultadoPeleas, putResultadoPeleas,
    getEnemigo
} from '../controllers/user.controller.js'

import { validarToken } from '../middlewares/validateTokens.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validateInputs } from '../middlewares/validateImputs.js';

const router = express.Router();

router.use(validarToken, validarRol('user'));

router.get('/personaje', getPersonaje)
router.put('/personaje', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    validateInputs
], setPersonaje)
router.patch('/personaje', [
    body('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], updatePersonaje)
router.delete('/personaje', [
    body('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], deletePersonaje)

router.get('/usuarios', getUsuarios)
router.patch('/usuarios/:id', [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], updateUsuario)
router.delete('/usuarios/:id', [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    validateInputs
], deleteUsuario)

router.get('/historial', getResultadoPeleas)
router.put('/historial', putResultadoPeleas)

router.get('/enemigo', getEnemigo)

export { router }
