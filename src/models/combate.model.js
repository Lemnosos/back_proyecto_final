import { pool } from '../utils/sqlConect.js';
import { crearCombate, obtenerCombatesPorPersonaje, obtenerCombatePorId, obtenerTodosCombates, borrarCombatesPorEnemigo, borrarCombatesPorPersonaje, borrarCombate, estadisticasGenerales, enemigosMasPeleados, combatesPorPersonaje, totalUsuarios, totalEnemigos } from '../utils/queries.js';

/**
 * Registra un nuevo combate.
 * @param {Object} body - Datos del combate (id_personaje, id_enemigo, resultado, turnos)
 * @returns {Promise<Object>} Combate creado
 */
export const create = async (body) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(crearCombate, [
            body.id_personaje, body.id_enemigo, body.resultado, body.turnos
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
 * Obtiene todos los combates de un personaje.
 * @param {number} personajeId - ID del personaje
 * @returns {Promise<Object[]>} Lista de combates ordenados por fecha descendente
 */
export const getByPersonajeId = async (personajeId) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerCombatesPorPersonaje, [personajeId]);
        return data.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

/**
 * Obtiene un combate por su ID.
 * @param {number} id - ID del combate (id_pelea)
 * @returns {Promise<Object|null>} Datos del combate o null si no existe
 */
export const getById = async (id) => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerCombatePorId, [id]);
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
 * Obtiene todos los combates registrados.
 * @returns {Promise<Object[]>} Lista de combates ordenados por fecha descendente
 */
export const getAll = async () => {
    let client;
    try {
        client = await pool.connect();
        const data = await client.query(obtenerTodosCombates);
        return data.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

/**
 * Elimina todos los combates de un enemigo.
 * @param {number} enemigoId - ID del enemigo
 */
export const deleteByEnemigo = async (enemigoId) => {
    let client;
    try {
        client = await pool.connect();
        await client.query(borrarCombatesPorEnemigo, [enemigoId]);
    } finally {
        if (client) client.release();
    }
};

/**
 * Elimina todos los combates de un personaje.
 * @param {number} personajeId - ID del personaje
 */
export const deleteByPersonaje = async (personajeId) => {
    let client;
    try {
        client = await pool.connect();
        await client.query(borrarCombatesPorPersonaje, [personajeId]);
    } finally {
        if (client) client.release();
    }
};

/**
 * Obtiene estadísticas globales de combates.
 * @returns {Promise<Object>} Estadísticas agregadas
 */
export const getEstadisticas = async () => {
    let client;
    try {
        client = await pool.connect();
        const [generales, enemigos, personajes, usuarios, enemigosTotal] = await Promise.all([
            client.query(estadisticasGenerales),
            client.query(enemigosMasPeleados),
            client.query(combatesPorPersonaje),
            client.query(totalUsuarios),
            client.query(totalEnemigos)
        ]);
        return {
            ...generales.rows[0],
            total_usuarios: usuarios.rows[0].total,
            total_enemigos: enemigosTotal.rows[0].total,
            enemigos_mas_peleados: enemigos.rows,
            combates_por_personaje: personajes.rows
        };
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) client.release();
    }
};
