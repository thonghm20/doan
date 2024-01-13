const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createNewCoupon = asyncHandler(async (req, res) => {
    const {name,discount,expiry} =req.body
    if(!name || !discount || !expiry ) throw new Error('Missing input')
    const response = await Coupon.create({
       ...req.body,
       expiry:Date.now() + +expiry * 24 * 60 * 60 * 1000
    });
    
    res.status(200).json({
        success: response ? true : false,
        createNewCoupon: response ? response : 'Cannot create new coupon'
    });
});


const getCoupon = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createAt -updateAt')
    res.status(200).json({
        success: response ? true : false,
        getCoupon: response ? response : 'Cannot get coupon'
    });
});

const updateCoupon = asyncHandler(async (req, res) => {
    const {cid} =req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing input')
    if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
    const response = await Coupon.findByIdAndUpdate(cid,req.body, {new:true});
    res.status(200).json({
        success: response ? true : false,
        updateCoupon: response ? response : 'Cannot update coupon'
    });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const {cid} =req.params
    const response = await Coupon.findByIdAndDelete(cid);
    res.status(200).json({
        success: response ? true : false,
        deleteCoupon: response ? response : 'Cannot delete coupon'  
    });
});
module.exports={
    createNewCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon
}