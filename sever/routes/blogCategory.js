const router = require('express').Router()
const ctrls = require('../controllers/blogCategory')
const{ verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')


router.post('/',verifyAccessToken, isAdmin,ctrls.createCategory)
router.get('/',ctrls.getCategories)
router.put('/:bid',verifyAccessToken, isAdmin,ctrls.updateCategory)
router.delete('/:bid',verifyAccessToken, isAdmin,ctrls.deleteCategory)


module.exports = router

//CRUD