import { pool } from '../utils/sqlConect.js';
import { obtenerTodosEnemigos, obtenerEnemigoPorId, crearEnemigo, borrarEnemigo, buildUpdateQuery } from '../utils/queries.js';

/**
 * Obtiene todos los enemigos.
 * @returns {Promise<Object[]>} Lista de enemigos
 */
export const getAll = async () => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerTodosEnemigos);
        return data.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

/**
 * Obtiene un enemigo por su ID.
 * @param {number} id - ID del enemigo
 * @returns {Promise<Object|null>} Datos del enemigo o null si no existe
 */
export const getById = async (id) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerEnemigoPorId, [id]);
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
 * Crea un nuevo enemigo.
 * @param {Object} body - Datos del enemigo (nombre, vida, ataque, defensa, velocidad, tipo)
 * @returns {Promise<Object>} Enemigo creado
 */
export const create = async (body) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(crearEnemigo, [
            body.nombre, body.vida, body.ataque, body.defensa, body.velocidad, body.tipo
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
 * Actualiza un enemigo existente.
 * @param {number} id - ID del enemigo
 * @param {Object} body - Campos a actualizar
 * @returns {Promise<Object|null>} Enemigo actualizado o null si no existe
 */
export const update = async (id, body) => {
    let client;
    try {
        client = await pool.connect();
        const { query, values } = buildUpdateQuery('enemigo', id, body);
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
 * Elimina un enemigo por su ID.
 * @param {number} id - ID del enemigo
 * @returns {Promise<Object|null>} Enemigo eliminado o null si no existe
 */
export const remove = async (id) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(borrarEnemigo, [id]);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};
