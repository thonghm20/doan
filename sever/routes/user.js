const router = require('express').Router()
const ctrls = require('../controllers/user')
const{ verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')


router.post('/register', ctrls.register)
router.post('/mock', ctrls.createUsers)
router.put('/finalregister/:token', ctrls.finalRegister)
router.post('/login',ctrls.login)
router.get('/current',verifyAccessToken,ctrls.getCurrent) 
router.post('/refeshtoken',ctrls.refreshAccessToken)
router.post('/forgotpassword',ctrls.forgotPassword) 
router.put('/resetpassword',ctrls.resetPassword) 
router.get('/',verifyAccessToken,isAdmin,ctrls.getUsers) 
router.delete('/:uid',verifyAccessToken,isAdmin,ctrls.deleteuser) 
router.put('/current',verifyAccessToken,uploader.single('avatar'),ctrls.upadateuser)
router.put('/address',verifyAccessToken,ctrls.upadateuserAddress)
router.put('/cart',verifyAccessToken,ctrls.updateCart)
router.delete('/remove-cart/:pid/:color',verifyAccessToken,ctrls.removeProductInCart)
router.put('/:uid',verifyAccessToken,isAdmin,ctrls.upadateuserbyadmin)
router.put('/wishlist/:pid',verifyAccessToken,ctrls.updateWishlist) 








module.exports = router

//CRUD