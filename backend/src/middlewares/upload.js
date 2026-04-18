const multer = require('multer');
const path   = require('path');
const { AppError } = require('../utils/response');

// ─── Configuración de almacenamiento en disco ─────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // carpeta uploads en raíz
  },
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const idUsuario = req.user?.idUsuario || 'anon';
  const idEvento  = req.params?.idEvento || req.body?.idEvento || 'evento';

  cb(null, `${idUsuario}-${idEvento}-${file.fieldname}${ext}`);
}

});


// ─── Filtros de tipo de archivo ───────────────────────────────────────────────
const soloImagenes = (req, file, cb) => {
  const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
  if (permitidos.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'), false);
};

// ─── Instancias de multer ─────────────────────────────────────────────────────
const multerEvento = multer({
  storage,
  fileFilter: soloImagenes,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('imagen');

const multerDocs = multer({
  storage,
  fileFilter: soloImagenes,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).fields([
  { name: 'ine',    maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
]);

// ─── Wrapper para errores de multer ──────────────────────────────────────────
const handleMulter = (multerFn) => (req, res, next) => {
  multerFn(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ ok: false, mensaje: 'El archivo supera el tamaño máximo.' });
    }
    return res.status(400).json({ ok: false, mensaje: err.message });
  });
};

// ─── Middleware: imagen de evento ─────────────────────────────────────────────
const uploadImagenEvento = [
  handleMulter(multerEvento),
  (req, res, next) => {
    try {
      // multer ya guarda el archivo en /uploads
      next();
    } catch (err) {
      next(new AppError('Error al guardar la imagen en el servidor.', 500));
    }
  },
];

// ─── Middleware: documentos de verificación (INE + selfie) ───────────────────
const uploadDocumentosVerificacion = [
  handleMulter(multerDocs),
  (req, res, next) => {
    try {
      // multer ya guarda los archivos en /uploads
      next();
    } catch (err) {
      next(new AppError('Error al guardar documentos en el servidor.', 500));
    }
  },
];

module.exports = { uploadImagenEvento, uploadDocumentosVerificacion };
