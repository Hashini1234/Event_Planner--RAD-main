import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/') && file.mimetype !== 'text/csv') {
      cb(new Error('Only image and CSV uploads are allowed'))
      return
    }
    cb(null, true)
  },
})
