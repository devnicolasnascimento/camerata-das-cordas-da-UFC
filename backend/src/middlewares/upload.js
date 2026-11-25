
const multer = require("multer");

const storage = multer.memoryStorage();

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Formato de imagem não permitido."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// Verifica o conteúdo real do arquivo
async function validateImage(req, res, next) {
    try {
        if (!req.file) {
            return next();
        }

        const { fileTypeFromBuffer } = await import("file-type");

        const fileType = await fileTypeFromBuffer(req.file.buffer);

        if (!fileType || !allowedTypes.includes(fileType.mime)) {
            return res.status(400).json({
                error: "O arquivo enviado não é uma imagem válida.",
            });
        }

        if (fileType.mime !== req.file.mimetype) {
            return res.status(400).json({
                error: "O formato declarado não corresponde ao arquivo.",
            });
        }

        next();
    } catch (error) {
        console.error("Erro ao validar imagem:", error);

        return res.status(500).json({
            error: "Não foi possível validar a imagem.",
        });
    }
}

upload.validateImage = validateImage;

module.exports = upload;
