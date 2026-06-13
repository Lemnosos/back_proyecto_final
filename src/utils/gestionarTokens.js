import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Genera un token JWT con el payload proporcionado.
 * @param {Object} payload - Datos a incluir en el token (id, rol)
 * @returns {Promise<string>} Token JWT
 * @throws {string} Si ocurre un error al firmar el token
 */
export const generarToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) {
                    console.log(error)
                    return reject(`Error al generar el token:\n${error}`)
                }
                resolve(token)
            }
        )
    })
}

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado
 * @throws {Error} Si el token es inválido o ha expirado
 */
export const comprobarToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw error;
    }
}
