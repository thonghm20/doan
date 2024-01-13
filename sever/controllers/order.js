const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {products, total, address,status} = req.body
    const user = await User.findById(_id);
    if(address){
       await User.findByIdAndUpdate(_id,{address,cart:[]})
    }
    const data = {products,total,orderBy:_id,email: user.email}
    if(status) data.status = status
    const rs = await Order.create(data) 
    return res.json({
        success: rs ? true:false,
        rs: rs ? rs :'Something went wrong',
    })
});



const updateStatus = asyncHandler(async (req, res) => {
    const {oid} = req.params
    const {status} = req.body
    if(!status) throw new Error ("Missing status")
    const response = await Order.findByIdAndUpdate(oid,{status},{new:true})
    return res.json({
        success: response ? true:false,
        response: response ? response :'Something went wrong',
        
    })
});

const getOrder = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const {_id} = req.user
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

    let queryObject = {orderBy:_id};

    // if (queries?.title) {
    //   queryObject.title = { $regex: queries.title, $options: 'i' };
    // }

    // if (queries?.category) {
    //   queryObject.category = { $regex: queries.category, $options: 'i' };
    // }

    // if (queries?.color) {
    //   const colorArr = queries.color?.split(',');
    //   queryObject.color = { $in: colorArr };
    // }

    // if (queries?.q) {
    //   const regexQuery = { $regex: queries.q, $options: 'i' };

    //   queryObject.$or = [
    //     { color: regexQuery },
    //     { title: regexQuery },
    //     { category: regexQuery },
    //     { brand: regexQuery },
    //     { description: regexQuery },
    //   ];
    // }

    const queryCommand = Order.find(queryObject);

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
    const counts = await Order.countDocuments(queryObject);

    return res.status(200).json({
      success: response ? true : false,
      Order: response ? response : "Cannot get product",
      counts
    });
});
const getOrderbyadmin = asyncHandler(async (req, res) => {
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

  // if (queries?.title) {
  //   queryObject.title = { $regex: queries.title, $options: 'i' };
  // }

  // if (queries?.category) {
  //   queryObject.category = { $regex: queries.category, $options: 'i' };
  // }

  // if (queries?.color) {
  //   const colorArr = queries.color?.split(',');
  //   queryObject.color = { $in: colorArr };
  // }

  // if (queries?.q) {
  //   const regexQuery = { $regex: queries.q, $options: 'i' };

  //   queryObject.$or = [
  //     { color: regexQuery },
  //     { title: regexQuery },
  //     { category: regexQuery },
  //     { brand: regexQuery },
  //     { description: regexQuery },
  //   ];
  // }

  const queryCommand = Order.find(queryObject);

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
  const counts = await Order.countDocuments(queryObject);

  return res.status(200).json({
    success: response ? true : false,
    Order: response ? response : "Cannot get product",
    counts
  });
});

module.exports={
    createOrder,
    updateStatus,
    getOrder,
    getOrderbyadmin 
}