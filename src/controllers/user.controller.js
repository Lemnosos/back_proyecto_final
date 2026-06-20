import * as Personaje from '../models/personaje.model.js'
import * as Usuario from '../models/user.model.js'
import * as Combate from '../models/combate.model.js'
import * as Enemigo from '../models/enemigo.model.js'
import { encriptarContraseña } from '../utils/gestionarContraseñas.js'

/**
 * Obtiene el personaje del usuario autenticado.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPersonaje = async (req, res) => {
    try {
        const personaje = await Personaje.getByUsuarioId(req.id)
        if (!personaje)
            return res.status(404).json({ ok: false, error: 'Personaje no encontrado' })
        res.status(200).json({ ok: true, data: { personaje } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener personaje' })
    }
}

/**
 * Crea un personaje para el usuario autenticado.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const setPersonaje = async (req, res) => {
    try {
        const personaje = await Personaje.create({ ...req.body, usuario_id: req.id })
        res.status(201).json({ ok: true, data: { msg: 'Personaje creado', personaje } })
    } catch (error) {
        if (error.code === '23505' || error.constraint?.includes('usuario_id'))
            return res.status(403).json({ ok: false, error: 'Ya tienes un personaje creado' })
        res.status(500).json({ ok: false, error: 'Error al crear personaje' })
    }
}

/**
 * Actualiza un personaje por su ID (en body).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updatePersonaje = async (req, res) => {
    try {
        const personaje = await Personaje.update(req.body.id, req.body)
        if (!personaje)
            return res.status(404).json({ ok: false, error: 'Personaje no encontrado' })
        res.status(200).json({ ok: true, data: { msg: 'Personaje actualizado', personaje } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al actualizar personaje' })
    }
}

/**
 * Elimina un personaje por su ID (en body).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deletePersonaje = async (req, res) => {
    try {
        const personaje = await Personaje.remove(req.body.id)
        if (!personaje)
            return res.status(404).json({ ok: false, error: 'Personaje no encontrado' })
        res.status(200).json({ ok: true, data: { msg: 'Personaje eliminado' } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al eliminar personaje' })
    }
}

/**
 * Obtiene los datos del usuario autenticado (sin contraseña).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getUsuarios = async (req, res) => {
    try {
        const usuario = await Usuario.getById(req.id)
        if (!usuario)
            return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
        const { password, ...datos } = usuario
        res.status(200).json({ ok: true, data: { usuario: datos } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener datos de usuario' })
    }
}

/**
 * Actualiza los datos del usuario (por ID en URL).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateUsuario = async (req, res) => {
    try {
        const body = { ...req.body }
        if (body.password) body.password = await encriptarContraseña(body.password)
        const usuario = await Usuario.update(req.params.id, body)
        if (!usuario)
            return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
        const { password, ...datos } = usuario
        res.status(200).json({ ok: true, data: { msg: 'Usuario actualizado', usuario: datos } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al actualizar usuario' })
    }
}

/**
 * Elimina un usuario por su ID (en URL).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.remove(req.params.id)
        if (!usuario)
            return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
        res.status(200).json({ ok: true, data: { msg: 'Usuario eliminado' } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al eliminar usuario' })
    }
}

/**
 * Guarda el resultado de un combate.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const putResultadoPeleas = async (req, res) => {
    try {
        const combate = await Combate.create(req.body)

        if (req.body.resultado === 'victoria') {
            const enemigo = await Enemigo.getById(req.body.id_enemigo)
            const personaje = await Personaje.getByUsuarioId(req.id)
            if (enemigo && personaje) {
                const xpGanada = Math.round(enemigo.vida * 0.5)
                await Personaje.update(personaje.id, {
                    experiencia: personaje.experiencia + xpGanada
                })
            }
        }

        res.status(201).json({ ok: true, data: { msg: 'Resultado guardado', combate } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al guardar resultado' })
    }
}

/**
 * Obtiene el historial de combates del personaje del usuario autenticado.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getResultadoPeleas = async (req, res) => {
    try {
        const personaje = await Personaje.getByUsuarioId(req.id)
        if (!personaje)
            return res.status(404).json({ ok: false, error: 'Personaje no encontrado' })

        const combates = await Combate.getByPersonajeId(personaje.id)
        res.status(200).json({ ok: true, data: { combates } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener historial' })
    }
}

/**
 * Obtiene un enemigo aleatorio para combatir.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getEnemigo = async (req, res) => {
    try {
        const enemigos = await Enemigo.getAll()
        if (enemigos.length === 0)
            return res.status(404).json({ ok: false, error: 'No hay enemigos disponibles' })

        const indice = Math.floor(Math.random() * enemigos.length)
        res.status(200).json({ ok: true, data: { enemigo: enemigos[indice] } })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener enemigo' })
    }
}
