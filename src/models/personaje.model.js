import { pool } from '../utils/sqlConect.js';
import { obtenerPersonajePorUsuarioId, obtenerPersonajePorId, crearPersonaje, borrarPersonaje, buildUpdateQuery } from '../utils/queries.js';

/**
 * Obtiene el personaje asociado a un usuario.
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<Object|null>} Datos del personaje o null si no tiene
 */
export const getByUsuarioId = async (usuarioId) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerPersonajePorUsuarioId, [usuarioId]);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

/**
 * Obtiene un personaje por su ID.
 * @param {number} id - ID del personaje
 * @returns {Promise<Object|null>} Datos del personaje o null si no existe
 */
export const getById = async (id) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerPersonajePorId, [id]);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

/**
 * Crea un nuevo personaje.
 * @param {Object} body - Datos del personaje (usuario_id, nombre, vida, ataque, defensa, velocidad, experiencia)
 * @returns {Promise<Object>} Personaje creado
 */
export const create = async (body) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(crearPersonaje, [
            body.usuario_id, body.nombre,
            body.vida, body.ataque, body.defensa, body.velocidad,
            body.experiencia
        ]);
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

/**
 * Actualiza un personaje existente.
 * @param {number} id - ID del personaje
 * @param {Object} body - Campos a actualizar
 * @returns {Promise<Object|null>} Personaje actualizado o null si no existe
 */
export const update = async (id, body) => {
    let client;
    try {
        client = await pool.connect();
        const { query, values } = buildUpdateQuery('personaje', id, body);
        const data = await client.query(query, values);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

/**
 * Elimina un personaje por su ID.
 * @param {number} id - ID del personaje
 * @returns {Promise<Object|null>} Personaje eliminado o null si no existe
 */
export const remove = async (id) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(borrarPersonaje, [id]);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};
