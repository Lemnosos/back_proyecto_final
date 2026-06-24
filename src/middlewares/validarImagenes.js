import multer from 'multer'

const MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

export const validarImagenes = (req, res, next) => {

    const upload = multer({ dest: "tmp/", limits: { fileSize: MAX_SIZE } });

    upload.single("image")(req, res, (err) => {

        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            req.errorImagen = { type: 'field', msg: 'La imagen no puede superar los 5MB', path: 'image', location: 'file' };
            return next();
        }
        if (err) return next(err);

        if (!req.file) {
            req.errorImagen = { type: 'field', msg: 'No se ha proporcionado ninguna imagen', path: 'image', location: 'file' };
            return next();
        }

        if (!MIME_TYPES.includes(req.file.mimetype)) {
            req.errorImagen = { type: 'field', msg: 'La imagen debe ser jpg, png, gif o webp', path: 'image', location: 'file' };
        }
        next();
    });
};