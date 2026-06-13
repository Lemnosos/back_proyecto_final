import { pool } from '../utils/sqlConect.js';
import { obtenerUsuarioPorEmail, obtenerUsuarioPorId, obtenerTodosUsuarios, crearUsuario, borrarUsuario, buildUpdateQuery } from '../utils/queries.js';

/**
 * Busca un usuario por su email.
 * @param {string} email - Email del usuario
 * @returns {Promise<Object|null>} Datos del usuario o null si no existe
 */
export const getUserByEmail = async (email) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerUsuarioPorEmail, [email]);
        if (data.rowCount === 1) return data.rows[0];
        return null;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
}

/**
 * Busca un usuario por su ID.
 * @param {number} id - ID del usuario
 * @returns {Promise<Object|null>} Datos del usuario o null si no existe
 */
export const getById = async (id) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerUsuarioPorId, [id]);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
}

/**
 * Obtiene todos los usuarios.
 * @returns {Promise<Object[]>} Lista de usuarios
 */
export const getAll = async () => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerTodosUsuarios);
        return data.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
}

/**
 * Crea un nuevo usuario.
 * @param {Object} body - Datos del usuario (nombre, apodo, email, password, rol)
 * @returns {Promise<Object>} Usuario creado
 */
export const createUser = async (body) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(crearUsuario, [
            body.nombre, body.apodo || null, body.email, body.password, body.rol || 'user'
        ]);
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
}

/**
 * Actualiza un usuario existente.
 * @param {number} id - ID del usuario
 * @param {Object} body - Campos a actualizar
 * @returns {Promise<Object|null>} Usuario actualizado o null si no existe
 */
export const update = async (id, body) => {
    let client;
    try {
        client = await pool.connect();
        const { query, values } = buildUpdateQuery('usuario', id, body);
        const data = await client.query(query, values);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
}

/**
 * Elimina un usuario por su ID.
 * @param {number} id - ID del usuario
 * @returns {Promise<Object|null>} Usuario eliminado o null si no existe
 */
export const remove = async (id) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(borrarUsuario, [id]);
        if (data.rowCount === 0) return null;
        return data.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
}
