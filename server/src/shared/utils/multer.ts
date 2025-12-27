import multer from 'multer';

let count=0;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       return cb(null, './oringinal_printing_files'); 
    },
    filename: function (req, file, cb) {
       return cb(null, `${++count}-${file.originalname}`) 
    }
});
export const upload = multer({ storage: storage });
