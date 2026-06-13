import { comprobarToken, generarToken } from "../utils/gestionarTokens.js"

/**
 * Middleware que valida el token JWT, extrae el payload (id, rol) y genera un nuevo token.
 * El nuevo token se envía en el header `x-token` (refresh automático).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validarToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1] || ""

        if (!token) {
            return res.status(400).json({
                ok: false,
                error: 'Token no enviado'
            });
        }

        const payload = comprobarToken(token)
        req.id = payload.id
        req.rol = payload.rol

        const nuevoToken = await generarToken({ id: payload.id, rol: payload.rol })
        res.setHeader('x-token', nuevoToken)

        next()

    } catch (error) {
        res.status(400).json({
            ok: false,
            error: 'Token inválido',
        });
    }

}
