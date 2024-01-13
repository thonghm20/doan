const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const data = require('../../data/ecommerce.json')
const slugify = require("slugify")
const categoryData = require('../../data/cate_brand')
const ProductCategory = require('../models/productCategory')
const fn = async(product) =>{
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 100) + '',
        description: product?.description,
        brand:product?.brand,
        price:Math.round(Number(product?.price?.match(/\d/g).join(''))/100),
        category: product?.category[1],
        quantity: Math.round(Math.random() *1000),
        sold:Math.round(Math.random() *100),
        images:product?.images,
        color:product?.variants?.find(el => el.label === 'Color')?.variants[0] || 'BLACK',
        thumb:product?.thumb,
        totalRating: 0
    })
}

const inserProduct = asyncHandler(async(req,res) =>{
   const promise = []
   for(let product of data) promise.push(fn(product))
   await Promise.all(promise)
    return res.status(200).json("done")
})
const fn2 =async(cate) =>{
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand,
        image: cate?.image

    })
}
const inserCategory = asyncHandler(async(req,res) =>{
    const promise = []
    console.log(categoryData)
    for(let cate of categoryData) promise.push(fn2(cate))
    await Promise.all(promise)
     return res.status(200).json("done")
 })
module.exports = {
    inserProduct,
    inserCategory
}
