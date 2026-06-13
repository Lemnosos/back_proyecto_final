import { app } from '../app.js'
import request from 'supertest'
import { pool } from '../utils/sqlConect.js'

const URL_BASE = process.env.URL_BASE || '/api/v1'

export { app, request, URL_BASE }

/**
 * Obtiene un token JWT válido para pruebas según el rol.
 * @param {'admin' | 'user'} rol
 * @returns {Promise<string>}
 */
export async function getToken(rol = 'admin') {
  const creds = rol === 'admin'
    ? { email: 'admin@test.com', password: 'Admin1234' }
    : { email: 'jugador@test.com', password: 'Jugador1234' }

  const res = await request(app)
    .post(`${URL_BASE}/public`)
    .send(creds)

  return res.body.data.token
}

/**
 * Crea un usuario temporal en BD y devuelve sus datos.
 * @param {string} suffix - para email único
 * @returns {Promise<{id: number, email: string, password: string}>}
 */
export async function crearUsuarioTemporal(suffix) {
  const { encriptarContraseña } = await import('../utils/gestionarContraseñas.js')
  const hash = await encriptarContraseña('Test1234')

  const { rows } = await pool.query(
    `INSERT INTO usuario (nombre, apodo, email, password, rol)
     VALUES ('Test', 'tester', $1, $2, 'user')
     RETURNING id, email`,
    [`test_${suffix}@test.com`, hash]
  )
  return { id: rows[0].id, email: rows[0].email, password: 'Test1234' }
}

/**
 * Elimina un usuario y su personaje creados durante tests.
 * @param {number} id
 */
export async function limpiarUsuario(id) {
  await pool.query('DELETE FROM combate WHERE id_personaje IN (SELECT id FROM personaje WHERE usuario_id = $1)', [id])
  await pool.query('DELETE FROM personaje WHERE usuario_id = $1', [id])
  await pool.query('DELETE FROM usuario WHERE id = $1', [id])
}
