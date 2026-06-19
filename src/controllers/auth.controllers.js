import { encriptarContraseña, compararContraseña } from '../utils/gestionarContraseñas.js'
import { generarToken } from '../utils/gestionarTokens.js'
import { getUserByEmail, createUser as createUserModel } from '../models/user.model.js'

const COOKIE_OPTS = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
}

/**
 * Controlador para registrar un nuevo usuario o admin.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createUser = async (req, res) => {
    try {
        const existe = await getUserByEmail(req.body.email)
        if (existe)
            return res.status(403).json({ ok: false, error: 'El email ya esta asignado a otro usuario' })

        req.body.password = await encriptarContraseña(req.body.password)
        const rol = req.body.rol || 'user'
        const usuario = await createUserModel({ ...req.body, rol })

        if (rol === 'admin') {
            return res.status(201).json({
                ok: true,
                data: { msg: 'Administrador creado' }
            })
        }

        const token = await generarToken({ id: usuario.id, rol })
        res.cookie('token', token, COOKIE_OPTS)

        return res.status(200).json({
            ok: true,
            data: { msg: 'Usuario creado', id: usuario.id, role: rol }
        })
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Fallo del servidor' })
    }
}

/**
 * Controlador para iniciar sesión.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const data = await getUserByEmail(email)

        if (!data)
            return res.status(403).json({
                ok: false,
                error: 'Credenciales inválidas'
            });

        if (!compararContraseña(password, data.password)) {

            return res.status(403).json({
                ok: false,
                error: 'Credenciales inválidas'
            });

        }

        const token = await generarToken({ id: data.id, rol: data.rol || 'user' });
        res.cookie('token', token, COOKIE_OPTS)

        return res.status(200).json({
            ok: true,
            data: { msg: 'Logueando usuario', id: data.id, role: data.rol || 'user' }
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            error: 'Error al loguear'
        });
    }

}

/**
 * Controlador para renovar el token JWT.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const renewToken = async (req, res) => {

    const nuevoToken = await generarToken({ id: req.id, rol: req.rol })
    res.cookie('token', nuevoToken, COOKIE_OPTS)

    return res.status(200).json({
        ok: true,
        data: { msg: 'Token renovado', id: req.id, role: req.rol }
    });
}

/**
 * Controlador para cerrar sesión.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const logoutUser = async (req, res) => {

    res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: false })

    return res.status(200).json({
        ok: true,
        data: { msg: 'Sesión cerrada' }
    });
}
