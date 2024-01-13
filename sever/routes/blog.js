const router = require('express').Router()
const ctrls = require('../controllers/blog')
const{ verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const upload = require('../config/cloudinary.config')
 
router.get('/',ctrls.getBlog)
router.get('/one/:bid',ctrls.getBLogs)
router.post('/',verifyAccessToken, isAdmin,ctrls.createNewBlog)
router.put('/:bid',verifyAccessToken, isAdmin,ctrls.updateBlog)
router.delete('/:bid',verifyAccessToken, isAdmin,ctrls.deleteBLogs)
router.put('/like/:bid',verifyAccessToken,ctrls.likeBlog)
router.put('/dislike/:bid',verifyAccessToken,ctrls.DislikeBlog)
router.put('/image/:bid',verifyAccessToken, isAdmin,upload.single('image'),ctrls.uploadImageBlog)



module.exports = router