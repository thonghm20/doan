const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const {title,description,category} =req.body
    if(!title || !description || !category ) throw new Error('Missing input')
    const response = await Blog.create(req.body);
    
    res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    });
});
const updateBlog = asyncHandler(async (req, res) => {
    const {bid} =req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await Blog.findByIdAndUpdate(bid,req.body,{new:true});
    res.status(200).json({
        success: response ? true : false,
        updateBlog: response ? response : 'Cannot update blog'
    });
});
const getBlog = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    res.status(200).json({
        success: response ? true : false,
        getBlog: response ? response : 'Cannot get blog'
    });
});

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;

    if (!bid) {
        throw new Error('Missing input');
    }

    const blog = await Blog.findById(bid);

    const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);

    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }

    const isLiked = blog?.likes?.find((el) => el.toString() === _id);

    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }
});
const DislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;

    if (!bid) {
        throw new Error('Missing input');
    }

    const blog = await Blog.findById(bid);

    const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);

    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }

    const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id);

    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }
});
const getBLogs = asyncHandler(async(req,res)=>{
    const{bid} = req.params
    const blog = await Blog.findByIdAndUpdate(bid,{$inc:{numberViews:1}},{new:true}).populate("likes","firstname lastname").populate("dislikes","firstname lastname")
    return res.json({
        success: blog ? true : false,
        rs: blog,
    });
})
const deleteBLogs = asyncHandler(async(req,res)=>{
    const{bid} = req.params
    const blog = await Blog.findByIdAndDelete(bid)
    return res.json({
        success: blog ? true : false,
        deleteBLogs: blog || 'Something went wrong'
    });
})
const uploadImageBlog  = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    if (!req.file) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path},{new: true})
    return res.status(200).json({
      status: response ? true : false,
      updatedProduct: response ? response : 'Cannot upload images product'
    })
    
  })
module.exports ={
    createNewBlog,
    updateBlog,
    getBlog,
    likeBlog,
    DislikeBlog,
    getBLogs,
    deleteBLogs,
    uploadImageBlog

}