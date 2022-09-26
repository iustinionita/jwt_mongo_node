const multer = require('multer');

function upload(location) {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, location)
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, file.fieldname + '-' + uniqueSuffix + ext)
            }
        });
        const upload = multer({ storage: storage }).single('image')
        return upload
    } catch (err) {
        console.log(err)
    }
}

module.exports = { upload }



// const up = upload('{LOCATION}');
//     up(req, res, function (err) {
//         if(err) {
//             res.sendStatus(500)
//         } else {
//             res.send(req.file)
//         }
//     })