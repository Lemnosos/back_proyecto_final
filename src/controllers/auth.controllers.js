import { encriptarContraseña, compararContraseña } from '../utils/gestionarContraseñas.js'
import { generarToken } from '../utils/gestionarTokens.js'
import { getUserByEmail, createUser as createUserModel } from '../models/user.model.js'

/**
 * Controlador para registrar un nuevo usuario.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createUser = async (req, res) => {
    try {

        let data = await getUserByEmail(req.body.email)

        if (data != null)
            return res.status(403).json({
                ok: false,
                error: 'El email ya esta asignado a otro usuario'
            })

        req.body.password = await encriptarContraseña(req.body.password)

        data = await createUserModel(req.body)

        console.log("usuario despues de la creacion", data)

        const token = await generarToken({ id: data.id, rol: 'user' })

        return res.status(200).json({
            ok: true,
            data: { msg: 'Creando usuario', token }
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: 'Fallo del servidor'
        })
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

        return res.status(200).json({
            ok: true,
            data: { msg: 'Logueando usuario', token }
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

    return res.status(200).json({
        ok: true,
        data: { msg: 'Renovando token', nuevoToken }
    });
}
