/**
 * Mapa de columnas actualizables por tabla.
 * @type {Object<string, string[]>}
 */
const CAMPOS_ACTUALIZABLES = {
    usuario: ['nombre', 'apodo', 'email', 'password', 'rol'],
    personaje: ['nombre', 'vida', 'ataque', 'defensa', 'velocidad', 'experiencia'],
    enemigo: ['nombre', 'vida', 'ataque', 'defensa', 'velocidad', 'tipo'],
    combate: ['id_personaje', 'id_enemigo', 'resultado', 'turnos']
};

/**
 * Mapa de nombres de clave primaria por tabla.
 * @type {Object<string, string>}
 */
const PK = {
    usuario: 'id',
    personaje: 'id',
    enemigo: 'id',
    combate: 'id_pelea'
};

/**
 * Construye dinámicamente una consulta UPDATE con sólo los campos presentes en body.
 * @param {string} tabla - Nombre de la tabla
 * @param {number|string} id - Valor de la clave primaria
 * @param {Object} body - Campos a actualizar
 * @returns {{ query: string, values: any[] }} Consulta SQL y valores parametrizados
 * @throws {Error} Si la tabla no existe o no hay campos para actualizar
 */
export function buildUpdateQuery(tabla, id, body) {
    const campos = CAMPOS_ACTUALIZABLES[tabla];
    if (!campos) throw new Error(`Tabla desconocida: ${tabla}`);

    let query = `UPDATE ${tabla} SET `;
    let values = [];
    let i = 1;

    for (const campo of campos) {
        if (body[campo] !== undefined) {
            query += `${campo} = $${i}, `;
            values.push(body[campo]);
            i++;
        }
    }

    if (values.length === 0) {
        throw new Error("No hay campos para actualizar");
    }

    query = query.slice(0, -2);
    query += ` WHERE ${PK[tabla]} = $${i} RETURNING *`;
    values.push(id);

    return { query, values };
}

/** @type {string} Busca usuario por email */
export const obtenerUsuarioPorEmail = `SELECT *
FROM usuario
WHERE email = $1`;
/** @type {string} Busca usuario por ID */
export const obtenerUsuarioPorId = `SELECT *
FROM usuario
WHERE id = $1`;
/** @type {string} Inserta un nuevo usuario */
export const crearUsuario = `INSERT INTO usuario (nombre, apodo, email, password, rol)
VALUES ($1, $2, $3, $4, $5)
RETURNING *`;
/** @type {string} Obtiene todos los usuarios ordenados por ID */
export const obtenerTodosUsuarios = `SELECT *
FROM usuario
ORDER BY id ASC`;
/** @type {string} Elimina un usuario por ID */
export const borrarUsuario = `DELETE
FROM usuario
WHERE id = $1
RETURNING *`;

/** @type {string} Busca personaje por ID de usuario */
export const obtenerPersonajePorUsuarioId = `SELECT *
FROM personaje
WHERE usuario_id = $1`;
/** @type {string} Busca personaje por ID */
export const obtenerPersonajePorId = `SELECT *
FROM personaje
WHERE id = $1`;
/** @type {string} Inserta un nuevo personaje */
export const crearPersonaje = `INSERT INTO personaje (usuario_id, nombre, vida, ataque, defensa, velocidad, experiencia)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *`;
/** @type {string} Elimina un personaje por ID */
export const borrarPersonaje = `DELETE
FROM personaje
WHERE id = $1
RETURNING *`;

/** @type {string} Obtiene todos los enemigos ordenados por ID */
export const obtenerTodosEnemigos = `SELECT *
FROM enemigo
ORDER BY id ASC`;
/** @type {string} Busca enemigo por ID */
export const obtenerEnemigoPorId = `SELECT *
FROM enemigo
WHERE id = $1`;
/** @type {string} Inserta un nuevo enemigo */
export const crearEnemigo = `INSERT INTO enemigo (nombre, vida, ataque, defensa, velocidad, tipo)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *`;
/** @type {string} Elimina un enemigo por ID */
export const borrarEnemigo = `DELETE
FROM enemigo
WHERE id = $1
RETURNING *`;

/** @type {string} Inserta un nuevo combate */
export const crearCombate = `INSERT INTO combate (id_personaje, id_enemigo, resultado, turnos)
VALUES ($1, $2, $3, $4)
RETURNING *`;
/** @type {string} Obtiene combates de un personaje ordenados por fecha descendente */
export const obtenerCombatesPorPersonaje = `SELECT c.*, e.nombre AS nombre_enemigo
FROM combate c
JOIN enemigo e ON c.id_enemigo = e.id
where c.id_personaje=$1`;

/** @type {string} Obtiene todos los combates ordenados por fecha descendente */
export const obtenerTodosCombates = `SELECT *
FROM combate
ORDER BY fecha DESC`;
/** @type {string} Busca combate por ID de pelea */
export const obtenerCombatePorId = `SELECT *
FROM combate
WHERE id_pelea = $1`;
/** @type {string} Elimina un combate por ID de pelea */
export const borrarCombate = `DELETE
FROM combate
WHERE id_pelea = $1
RETURNING *`;
