import { comprobarToken, generarToken } from "../utils/gestionarTokens.js"

const COOKIE_OPTS = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60
}

/**
 * Middleware que valida el token JWT desde la cookie, extrae el payload (id, rol) y renueva el token.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validarToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token

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
        res.cookie('token', nuevoToken, COOKIE_OPTS)

        next()

    } catch (error) {
        res.status(400).json({
            ok: false,
            error: 'Token inválido',
        });
    }

}
