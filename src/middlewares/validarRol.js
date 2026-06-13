/**
 * Middleware que verifica que el rol del usuario esté entre los permitidos.
 * @param {...string} roles - Roles permitidos (ej: 'admin', 'user')
 * @returns {function} Middleware de Express
 */
export const validarRol = (...roles) => (req, res, next) => {
    try {
        const rol = req.rol;
        if (!rol) {
            return res.status(400).json({
                ok: false,
                error: "Rol desconocido"
            });
        }
        if (!roles.includes(rol)) {
            return res.status(403).json({
                ok: false,
                error: `Acceso denegado. Roles permitidos: ${roles.join(', ')}`
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Error al validar el rol"
        });
    }
};
