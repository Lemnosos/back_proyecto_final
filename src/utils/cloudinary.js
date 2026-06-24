import { v2 as cloudinary } from "cloudinary";
import { unlink } from 'node:fs/promises'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube una imagen a Cloudinary
 * @param {Object} file - req.file de multer
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const subirImagenCloudinary = async (file, enemyName) => {
    try {
        if (!file) {
            throw new Error("No se ha proporcionado ningún archivo");
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "imagenes",
            public_id: enemyName.replace(/\s+/g, '_'),
            transformation: [{ width: 300, height: 400, crop: 'fit' }]
        });

        await unlink(file.path).catch(() => {})

        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error("Error subiendo imagen a Cloudinary:", error);
        throw error;
    }
};