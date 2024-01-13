const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const makeSKU = require('uniqid')

const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, brand, category, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req.files?.images?.map((el) => el.path);

  // Check if any of the required fields is missing
  if (!(title && price && description && brand && category && color)) {
      return res.status(400).json({
          success: false,
          error: 'Missing input',
      });
  }

  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;

  try {
      const newProduct = await Product.create(req.body);

      return res.status(201).json({
          success: true,
          createdProduct: newProduct,
          mes:'Created'
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          error: 'Could not create new product',
      });
  }
});


const getProducts = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];

    excludeFields.forEach((el) => {
      delete queries[el];
    });

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (matchedEl) => `$${matchedEl}`
    );

    let queryObject = {};

    if (queries?.title) {
      queryObject.title = { $regex: queries.title, $options: 'i' };
    }

    if (queries?.category) {
      queryObject.category = { $regex: queries.category, $options: 'i' };
    }
    if (queries?.brand) {
      queryObject.brand = { $regex: queries.brand, $options: 'i' };
    }
    if (queries?.color) {
      const colorArr = queries.color?.split(',');
      queryObject.color = { $in: colorArr };
    }

    if (queries?.q) {
      const regexQuery = { $regex: queries.q, $options: 'i' };

      queryObject.$or = [
        { color: regexQuery },
        { title: regexQuery },
        { category: regexQuery },
        { brand: regexQuery },
        { description: regexQuery },
      ];
    }

    const queryCommand = Product.find(queryObject);

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queryCommand.sort(sortBy);
    }

    // Fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    const response = await queryCommand.exec();
    const counts = await Product.countDocuments(queryObject);

    return res.status(200).json({
      success: response ? true : false,
      products: response ? response : "Cannot get product",
      counts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

  

  
const getProduct = asyncHandler(async(req,res) =>{
    const {pid} =req.params
    const product = await Product.findById(pid).populate({
      path:'ratings',
      populate:{
        path:'posttedBy',
        select:'firstname lastname avatar'
      }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product: "Cannot get product"
    })
})
const updateProduct = asyncHandler(async(req,res) =>{
    const {pid} = req.params
    const files = req?.files
    if(files?.thumb) req.body.thumb = files?.thumb[0]?.path
    if(files?.images) req.body.images = files?.images?.map(el => el.path)
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title) 
    const updatedProduct = await Product.findByIdAndUpdate(pid,req.body, {new: true})
    return res.status(200).json({
        success: updatedProduct ? true : false,
        mes: updatedProduct ? 'Updated': "Cannot update product"
    })
})
const deleteProduct = asyncHandler(async(req,res) =>{
    const {pid} = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProduct ? true : false,
        mes: deleteProduct ? 'Deleted': "Cannot delete product"
    })
})
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updateAt } = req.body;

  if (!star || !pid) {
      throw new Error('Missing input');
  }

  const ratingProduct = await Product.findById(pid);

  if (!ratingProduct) {
      throw new Error('Product not found');
  }

  const alreadyRating = ratingProduct.ratings.find(el => el.posttedBy && el.posttedBy.toString() === _id);

  if (alreadyRating) {
      await Product.updateOne(
          { _id: pid, 'ratings.posttedBy': _id },
          { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment, 'ratings.$.updateAt': updateAt } },
          { new: true }
      );
  } else {
      await Product.findByIdAndUpdate(
          pid,
          { $push: { ratings: { star, comment, posttedBy: _id, updateAt } } },
          { new: true }
      );
  }

  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0);
  updatedProduct.totalRating = Math.round((sumRatings * 10) / ratingCount) / 10;
  await updatedProduct.save();

  return res.status(200).json({
      success: true,
      updatedProduct
  });
});
const uploadImageProduct  = asyncHandler(async(req,res)=>{
  const {pid} = req.params
  if (!req.files) throw new Error('Missing inputs')
  const response = await Product.findByIdAndUpdate(pid, { $push:{ images:{ $each: req.files.map(el => el.path)} }},{new: true})
  return res.status(200).json({
    success: response ? true : false,
    updatedProduct: response ? response : 'Cannot upload images product'
  })
  
})

const mongoose = require('mongoose');

// ...

const addVarriants = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { title, price, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req?.files?.images?.map((el) => el.path);

  if (!(title && price && color)) {
    return res.status(400).json({
      success: false,
      error: 'Missing input',
    });
  }

  // Convert pid to ObjectId
  const productId = mongoose.Types.ObjectId(pid);

  const response = await Product.findByIdAndUpdate(
    productId,
    {
      $push: {
        varriants: { color, price, title, thumb, images, sku: makeSKU().toUpperCase() },
      },
    },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    mes: response ? 'Added avarriant' : 'Cannot upload images product',
  });
});


module.exports ={
    addVarriants,
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImageProduct,
}