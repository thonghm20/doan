const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body);
    
    res.status(200).json({
        success: response ? true : false,
        createdCategory: response ? response : 'Cannot create new blog-category'
    });
});
const getCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('title _id');
    res.status(200).json({
        success: response ? true : false,
        getCategories: response ? response : 'Cannot get blog-category'
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const {bid} =req.params
    const response = await BlogCategory.findByIdAndUpdate(bid,req.body,{new:true})
    res.status(200).json({
        success: response ? true : false,
        updateCategory: response ? response : 'Cannot update blog-category'
    });
});
const deleteCategory = asyncHandler(async (req, res) => {
    const {bid} =req.params
    const response = await BlogCategory.findByIdAndDelete(bid)
    res.status(200).json({
        success: response ? true : false,
        deleteCategory: response ? response : 'Cannot delete blog-category'
    });
});



module.exports ={
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}