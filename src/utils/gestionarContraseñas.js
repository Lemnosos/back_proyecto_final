import bcrypt from 'bcryptjs'

const saltRounds = Number(process.env.BCRYPTJS_INT) || 10;

/**
 * Encripta una contraseña usando bcryptjs.
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
export async function encriptarContraseña(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

/**
 * Compara una contraseña en texto plano con su hash.
 * @param {string} pass - Contraseña en texto plano
 * @param {string} encPass - Hash almacenado
 * @returns {boolean} true si coinciden
 */
export const compararContraseña = (pass, encPass) => {
    return bcrypt.compareSync(pass, encPass);
}
