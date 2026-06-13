import { validationResult } from 'express-validator';

/**
 * Middleware que valida los resultados de express-validator.
 * Si hay errores, responde con 400 y la lista de errores.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateInputs = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            error: "Error de validación",
            errores: errors.mapped()
        });
    }

    next();
};
