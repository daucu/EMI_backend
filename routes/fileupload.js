const router = require("express").Router();
const upload = require('../config/image_upload')


router.post('/', upload.single('file'), (req, res) => {
    try {
        const url = req.protocol + "://" + req.get("host") + "/medias/" + req.file.filename;
        return res.json({
            message: "File uploaded successfully",
            url: url
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

module.exports = router