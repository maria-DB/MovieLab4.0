const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const sendToken = require('../utils/jwtToken');

//Get all users => /api/v1/users
exports.getAllUsers = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.find()

    res.status(200).json({
        success:true,
        user
    })
})

//get single user details => /api/v1/users/:id
exports.getUserInfo = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler('User not found', 404));

    res.status(200).json({
        success:true,
        user
    })
})

// create user/register =>/api/v1/users
exports.registerUser = catchAsyncErrors(async (req,res,next) =>{
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'userAvatars',
        width:150,
        crop:'scale'
    })

    const user = await User.create({
        name : req.body.name,
        email : req.body.email,
        avatar : [{
            public_id : result.public_id,
            url : result.secure_url
        }]
    })

    sendToken(user, 200, res)
})

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req,res,next) =>{
    const user = await await User.findOne({ email : req.body.email });

    if(!user) return next(new ErrorHandler('Invalid or Unauthorized User', 404));

    sendToken(user, 200, res)
})

//Logout users => /api/v1/Logout
exports.logoutUser = catchAsyncErrors(async (req,res,next) =>{
    res.cookie('token', null, {
        expires : new Date(Date.now()), 
        httpOnly : true
    })

    res.status(200).json({
        success : true,
        message : 'Logges Out'
    })

})

// Google register => /api/v1/google/register
exports.googleRegister = catchAsyncErrors(async (req,res,next) => {
    let user = await User.findOne({email: req.body.email});

    if(!user) {

        const result = await cloudinary.v2.uploader.upload(req.body.imageUrl, {
            folder:'userAvatars',
            width:150,
            crop:'scale'
        })
    
        const user = await User.create({
            name : req.body.name,
            email : req.body.email,
            avatar : [{
                public_id : result.public_id,
                url: result.secure_url
            }]
        })
    
        sendToken(user, 200, res)

    } else {
        sendToken(user, 200, res)
    }
})