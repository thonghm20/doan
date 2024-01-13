const router = require('express').Router()
const ctrls = require('../controllers/product')
const{ verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')


router.post('/',verifyAccessToken, isAdmin,uploader.fields([
    {name: 'images', maxCount:10},
    {name:'thumb', maxCount:1}
]), ctrls.createProduct)
router.get('/', ctrls.getProducts)
router.put('/ratings',verifyAccessToken, ctrls.ratings)
router.put('/uploadimage/:pid', verifyAccessToken, isAdmin, uploader.array('images',10), ctrls.uploadImageProduct)
router.put('/varriant/:pid', uploader.fields([
    {name: 'images', maxCount:10},
    {name:'thumb', maxCount:1}
]),verifyAccessToken, isAdmin, ctrls.addVarriants)
router.put('/:pid', uploader.fields([
    {name: 'images', maxCount:10},
    {name:'thumb', maxCount:1}  
]),verifyAccessToken, isAdmin, ctrls.updateProduct)
router.delete('/:pid',verifyAccessToken, isAdmin, ctrls.deleteProduct)
router.get('/:pid', ctrls.getProduct)











module.exports = router

//CRUD