import * as Enemigo from '../models/enemigo.model.js'
import * as Usuario from '../models/user.model.js'
import * as Combate from '../models/combate.model.js'
import * as Personaje from '../models/personaje.model.js'
import { encriptarContraseña } from '../utils/gestionarContraseñas.js'

/**
 * Obtiene todos los enemigos, o uno específico si se pasa `?id=X`.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getEnemigos = async (req, res) => {
    try {
        if (req.query.id) {
            const enemigo = await Enemigo.getById(req.query.id)
            if (!enemigo)
                return res.status(404).json({ ok: false, error: 'Enemigo no encontrado' })
            return res.status(200).json({ ok: true, data: { enemigo } })
        }
        const enemigos = await Enemigo.getAll()
        res.status(200).json({ ok: true, data: { enemigos } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener enemigos' })
    }
}

/**
 * Crea un nuevo enemigo.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const setEnemigos = async (req, res) => {
    try {
        const enemigo = await Enemigo.create(req.body)
        res.status(201).json({ ok: true, data: { msg: 'Enemigo creado', enemigo } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al crear enemigo' })
    }
}

/**
 * Actualiza un enemigo existente.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateEnemigos = async (req, res) => {
    try {
        const enemigo = await Enemigo.update(req.body.id, req.body)
        if (!enemigo)
            return res.status(404).json({ ok: false, error: 'Enemigo no encontrado' })
        res.status(200).json({ ok: true, data: { msg: 'Enemigo actualizado', enemigo } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al actualizar enemigo' })
    }
}

/**
 * Elimina un enemigo por su ID (en body).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteEnemigos = async (req, res) => {
    try {
        await Combate.deleteByEnemigo(req.body.id)
        const enemigo = await Enemigo.remove(req.body.id)
        if (!enemigo)
            return res.status(404).json({ ok: false, error: 'Enemigo no encontrado' })
        res.status(200).json({ ok: true, data: { msg: 'Enemigo eliminado' } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al eliminar enemigo' })
    }
}

/**
 * Obtiene todos los usuarios.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.getAll()
        res.status(200).json({ ok: true, data: { usuarios } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener usuarios' })
    }
}

/**
 * Obtiene un usuario por su ID (en URL).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getUsuariosById = async (req, res) => {
    try {
        const usuario = await Usuario.getById(req.params.id)
        if (!usuario)
            return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
        res.status(200).json({ ok: true, data: { usuario } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener usuario' })
    }
}

/**
 * Actualiza un usuario por su ID (en URL).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const setUsuarios = async (req, res) => {
    try {
        const body = { ...req.body }
        if (body.password) body.password = await encriptarContraseña(body.password)
        const usuario = await Usuario.update(req.params.id, body)
        if (!usuario)
            return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
        res.status(200).json({ ok: true, data: { msg: 'Usuario actualizado', usuario } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al actualizar usuario' })
    }
}

/**
 * Elimina un usuario por su ID (en URL).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteUsuarios = async (req, res) => {
    try {
        const personaje = await Personaje.getByUsuarioId(req.params.id)
        if (personaje) {
            await Combate.deleteByPersonaje(personaje.id)
            await Personaje.remove(personaje.id)
        }
        const usuario = await Usuario.remove(req.params.id)
        if (!usuario)
            return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
        res.status(200).json({ ok: true, data: { msg: 'Usuario eliminado' } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al eliminar usuario' })
    }
}

/**
 * Obtiene el historial completo de peleas.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getHistorialPeleas = async (req, res) => {
    try {
        const combates = await Combate.getAll()
        res.status(200).json({ ok: true, data: { combates } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener historial' })
    }
}


