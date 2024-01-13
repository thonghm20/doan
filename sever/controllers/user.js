const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const {gennerateAccessToken , gennerateRefreshToken} = require('../middlewares/jwt')
const jwt = require ("jsonwebtoken")
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')
const {users} = require('../ultils/containt')
const user = require('../models/user')

// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstname, lastname } = req.body;
    
//     if (!email || !password || !firstname || !lastname) {
//       return res.status(400).json({
//         success: false,
//         mes: 'Missing inputs'
//       });
//     }
  
//     try {
        
//       const user = await User.findOne({email})  
//       if(user) 
//             throw new Error('User has existed!')
//       else{
//             const newUser = await User.create(req.body)
//             return res.status(200).json({
//                 success: newUser ? true : false,
//                 mes: newUser ? 'Register is successfully' : 'Something went wrong'
//             })
//       }
      
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         mes: 'Error in user creation',
//         error: error.mes
//       });
//     }
    
//   });
const register = asyncHandler(async(req,res)=>{
  const {email,password,firstname, lastname, mobile} = req.body
  if (!email || !password || !firstname || !lastname || !mobile) 
          return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
          });
    const user = await User.findOne({email})  
           if(user) 
                throw new Error('User has existed!')
            else{
                   const token = makeToken()
                   const emailedited = Buffer.from(email).toString('base64') + '@' + token
                   const newUser = await User.create({
                    email : emailedited, password, firstname, lastname, mobile
                });
                if(newUser){
                  res.cookie('dataregister',{...req.body, token}, {httpOnly: true,maxAge: 15*60*1000})
                  const html = `<h2>Register code:</h2><br /><blockquote>${token}</blockquote>`;
                  await sendMail({email,html,subject: 'Conform register account in Digital World '})
                }
                setTimeout(async() => {
                    await User.deleteOne({email: emailedited})
                }, [300000]);
                  return res.json({
                    success:true,
                    mes:newUser ?'Please check your email to active account' :'Some went wrong , try to late'
                  })
                }
                   })
                    
const finalRegister = asyncHandler(async(req,res) =>{
    const {token} = req.params
    const notActivedEmail = await User.findOne({email: new RegExp(`${token}$`)})
    if(notActivedEmail){
      notActivedEmail.email = Buffer.from(notActivedEmail?.email?.split('@')[0], 'base64').toString('utf-8');
      notActivedEmail.save()
    }
    return res.json({
      success:notActivedEmail ? true : false,
      mes:notActivedEmail ? 'Register is Success' :'Some went wrong , try to late'
    })
   
})
  
  const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password ) {
      return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
      });
    }
      const response = await User.findOne({email})
      if(response && await response.isCorrectPassword(password)){
        //tach password va role ra khoi response
      const { password , role,refreshToken, ...userData} = response.toObject()
      const accessToken = gennerateAccessToken(response._id,role)
      const newrefreshToken = gennerateRefreshToken(response._id)
      // Luu refresh token vao database
      await User.findByIdAndUpdate(response._id,{refreshToken:newrefreshToken},{new:true})
      //luu refresh token vao cookie
      res.cookie('refreshToken',refreshToken,{httpOnly: true, maxAge: 7*24*60*60*1000})
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
      }else{
        throw new Error('Invalid credentials!')
      }
  });
  
  const getCurrent = asyncHandler(async (req, res) => {
      const{ _id}  = req.user 
      const user = await User.findById(_id).select('-refreshToken -password ').populate({
        path:'cart',
        populate:{
          path:'product',
          select:'title thumb price'
        }
      }).populate('wishlist','title thumb price color')
      return res.status(200).json({
        success:user? true: false,
        rs: user ? user :'User not found'
      })
  });
  const refreshAccessToken = asyncHandler (async(req, res) =>{
    const cookie = req.cookies
    if(!cookie  && !cookie.refreshToken) throw new Error('No refresh Token')

    const rs = await jwt.verify(cookie.refreshToken,process.env.JWT_SECRET)
   const response =await User.findOne({_id:rs._id,refreshToken:cookie.refreshToken})
      return res.status(200).json({
        success:response ? true:false,
        newAccessToken: response ? gennerateAccessToken(response._id ,response.role):"Refresh to invalid"
      })
  })
  const logout = asyncHandler(async(req,res) => {
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken:''},{new:true})
    res.clearCookie('refreshToken',{
      httpOnly: true,
      secure: true
    })
    return res.status(200).json({
      success: true,
      mes:'Logout thanh cong'
    })
  })
    const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error('Missing email');
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const resetToken = user.createPasswordChangedToken()
    await user.save()
    const html = `Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu: <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Đặt lại mật khẩu</a>`;
    const data ={
     email,
      html,
      subject: 'Forgot password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
      success: rs.response?.includes('OK') ? true : false,
      mes: rs.response?.includes('OK') ?'Hãy check mail của bạn' :'Đã có lỗi hãy thử lại sau'
    })
  });
  const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})
const getUsers = asyncHandler(async(req,res)=>{
  try {
    const {_id} = req.user
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];

    excludeFields.forEach((el) => {
      delete queries[el];
    });

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (matchedEl) => `$${matchedEl}`
    );
    const formattedQueries = JSON.parse(queryString);
    let colorQueryObject

    // Filtering
    if (queries?.name) {
      formattedQueries.name = { $regex: queries.name, $options: 'i' };
    }
    if(req.query.q){
      delete formattedQueries.q
      formattedQueries['$or'] = [
        
         {firstname: { $regex: req.query.q, $options: 'i'}},
         {lastname: { $regex: req.query.q, $options: 'i'}},
         {email: { $regex: req.query.q, $options: 'i'}}
         ]
        
    }
    let queryCommand = User.find(formattedQueries);

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queryCommand = queryCommand.sort(sortBy);
    }
    //Fields limiting
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ')
      queryCommand = queryCommand.select(fields)
    }

    //Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)



    const response = await queryCommand.exec();
    const counts = await User.find(formattedQueries).countDocuments();

    return res.status(200).json({
      success: response ? true : false,
      users: response ? response : "Cannot get product",
      counts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
})
const deleteuser = asyncHandler(async(req,res)=>{
  const {uid} = req.params
  const response = await User.findByIdAndDelete(uid)
  return res.status(200).json({
    success: response ? true:false,
    mes: response ? `User with email ${response.email} deleted` :`No user delete`
  })
})
const upadateuser = asyncHandler(async(req,res)=>{
  const {_id} = req.user
  const {firstname,lastname,email,mobile,address} = req.body
  const data = {firstname,lastname,email,mobile,address}
  if(req.file) data.avatar = req.file.path
  if(!_id || Object.keys(req.body).length === 0) throw new Error('Missing input')
  const response = await User.findByIdAndUpdate(_id,data,{new: true}).select('-password -role -refreshToken')
  return res.status(200).json({
    success: response ? true:false,
    mes: response ? 'Updated' :'Some thing wrong'
  })
})
const upadateuserbyadmin = asyncHandler(async(req,res)=>{
  const {uid} = req.params
  if(Object.keys(req.body).length === 0) throw new Error('Missing input')
  const response = await User.findByIdAndUpdate(uid,req.body,{new: true}).select('-password -role -refreshToken')
  return res.status(200).json({
    success: response ? true:false,
    mes: response ? 'Updated' :'Some thing wrong'
  })
})

const upadateuserAddress = asyncHandler(async(req,res)=>{
  const {_id} = req.user
  if(!req.body.address) throw new Error('Missing input')
  const response = await User.findByIdAndUpdate(_id,{$push: {address:req.body.address}},{new: true}).select('-password -role -refreshToken')
  return res.status(200).json({
    success: response ? true:false,
    upadateUser: response ? response :'Some thing wrong'
  })
})
const updateCart = asyncHandler(async(req,res)=>{
  const {_id} = req.user
  const {pid , quantity = 1, color, price, thumbnail, title} = req.body
  if(!pid || !color) throw new Error('Missing inputs')
  const user = await User.findById(_id).select('cart')
  const alreadyProdut = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
  if(alreadyProdut){
    if(alreadyProdut.color === color){
      const response = await User.updateOne({cart: {$elemMatch: alreadyProdut} }, {$set:{"cart.$.quantity":quantity, "cart.$.price":price,"cart.$.thumbnail":thumbnail, "cart.$.title":title}}, {new:true})
      return res.status(200).json({
        success: response ? true: false,
        mes: response ? 'Updated your cart' : 'Some thing went wrong'
      })
    }
  }else{
    const response = await User.findByIdAndUpdate(_id , {$push: {cart: {product: pid, quantity , color, price, thumbnail,title}}}, {new:true})
    return res.status(200).json({
      success: response ? true: false,
      mes: response ? 'Updated your cart' : 'Some thing went wrong'
    })
  }
})

const removeProductInCart =  asyncHandler(async(req,res)=>{
  const {_id} = req.user
  const {pid, color } = req.params
  const user = await User.findById(_id).select('cart')
  const alreadyProdut = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
  if(!alreadyProdut)  return res.status(200).json({
    success: true,
    mes: 'Updated your cart' 
  })
  const response = await User.findByIdAndUpdate(_id , {$pull: {cart: {product: pid, color}}}, {new:true})
    return res.status(200).json({
      success: response ? true: false,
      mes: response ? 'Updated your cart' : 'Some thing went wrong'
})
})
const createUsers = asyncHandler(async(req,res) =>{
  const response = await User.create(users)
  return res.status(200).json({
    success: response ? true:false,
    upadateuser: response ? response :'Some thing wrong'
  })
})
  const updateWishlist = asyncHandler(async(req,res) =>{
    const {pid} = req.params  
    const {_id} = req.user
    const user = await User.findById(_id)
    const alreadyInWishlist = user.wishlist?.find((el) => el.toString() === pid)
    if(alreadyInWishlist){  
      const response = await User.findByIdAndUpdate(_id, { $pull: { wishlist: pid } }, { new: true });
      return res.json({
        success: response ? true:false,
        mes: response ? 'Updated your wishlist' :'Some thing wrong'
      })
    }else{
      const response = await User.findByIdAndUpdate(_id, { $push: { wishlist: pid } }, { new: true });
      return res.json({
          success: response ? true : false,
          mes: response ? 'Updated your wishlist' :'Some thing wrong'
      });
    }
  
  })
  
module.exports ={
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteuser,
    upadateuser,
    upadateuserbyadmin,
    upadateuserAddress,
    updateCart,
    finalRegister,
    createUsers,
    removeProductInCart,
    updateWishlist
}