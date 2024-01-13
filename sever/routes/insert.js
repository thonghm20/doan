const router = require('express').Router()
const ctrls = require('../controllers/inserdata')
 

router.post('/',ctrls.inserProduct)
router.post('/cate',ctrls.inserCategory)




module.exports = router