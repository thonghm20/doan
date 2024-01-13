const userRouter = require('./user')
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const blogCategoryRouter = require('./blogCategory')
const brandRouter = require('./brand')
const blog = require('./blog')
const order = require('./order')
const insert = require('./insert')
const couponRouter = require('./coupon')
const {notFound,errHandler} = require('../middlewares/errHandler')

const initRoutes = (app) =>{ 
    app.use('/api/user',userRouter)
    app.use('/api/product',productRouter)
    app.use('/api/productcategory',productCategoryRouter)
    app.use('/api/blogcategory',blogCategoryRouter)
    app.use('/api/blog',blog)
    app.use('/api/order',order)
    app.use('/api/brand',brandRouter)
    app.use('/api/coupon',couponRouter)
    app.use('/api/insert',insert)


    app.use(notFound)
    app.use(errHandler)
}
module.exports = initRoutes