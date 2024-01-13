const brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createBrand = asyncHandler(async (req, res) => {
    const response = await brand.create(req.body);
    
    res.status(200).json({
        success: response ? true : false,
        createBrand: response ? response : 'Cannot create new brand'
    });
});
const getBrand = asyncHandler(async (req, res) => {
    const response = await brand.find()
    res.status(200).json({
        success: response ? true : false,
        getBrand: response ? response : 'Cannot get brand'
    });
});

const updateBrand = asyncHandler(async (req, res) => {
    const {bid} =req.params
    const response = await brand.findByIdAndUpdate(bid,req.body,{new:true})
    res.status(200).json({
        success: response ? true : false,
        updateBrand: response ? response : 'Cannot update brand'
    });
});
const deleteBrand = asyncHandler(async (req, res) => {
    const {bid} =req.params
    const response = await brand.findByIdAndDelete(bid)
    res.status(200).json({
        success: response ? true : false,
        deleteBrand: response ? response : 'Cannot delete brand'
    });
});



module.exports ={
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
}