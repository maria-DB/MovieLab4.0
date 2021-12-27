const Member = require('../models/member');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const sendToken = require('../utils/jwtToken');
const { registerUser } = require('./userController');
const swearjar = require('swearjar');
const { query } = require('express');

//create new member => /api/v1/members/new
exports.newMember = catchAsyncErrors(async (req,res,next) =>{
    let images = []


    if(typeof req.body.images === 'string'){
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imageLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder : 'avatar'
        })

        imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.avatar = imageLinks

    const member = await Member.create({
        name: req.body.name,
        role: req.body.role,
        info: req.body.info,
        avatar: req.body.avatar
    })

    res.status(200).json({
        success:true,
        message:`${member.role} has been created`
    })
})

//Get staff Details
exports.memberDetail = catchAsyncErrors(async (req,res,next) => {
    const member = await Member.findById(req.params.id);

    if(!member) return next(new ErrorHandler('Member Not Found', 404));

    res.status(200).json({
        success:true,
        member
    })
})

//get all member by role
exports.getAllMemberByRole = catchAsyncErrors(async (req,res,next) => {
    const resPerPage  = 20;

    const apiFeatures = new APIFeatures(Member.find(), req.query)
        .search()
        .filter()
    
    let members = await apiFeatures.query;
    let membersCount = members.length;
    apiFeatures.pagination(resPerPage);
    members = await apiFeatures.query;

    res.status(200).json({
        sucess:true,
        membersCount,
        resPerPage,
        members
    })

})

//Update Members => /api/v1/persons/:id
exports.updateMember = catchAsyncErrors(async (req,res,next) => {
    let member = await Member.findById(req.params.id);

    if(!member) return next(new ErrorHandler('Member not Found', 404));

    let images = [];

    if(typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if(images !== undefined) {
        //Delete
        for(let i = 0; i < member.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(member.images[i].public_id)

        }

        let imageLinks = [];

        for(let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.upluader.upload(images[i], {
                folder : 'images'
            })

            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.avatar = imageLinks
    }

    member = await Member.findByIdAndUpdate(req.params.id,req.body, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success:true,
        message: "Member Updated",
        member
    })

})

//delete member => /api/v1/members/:id
exports.deleteMember = catchAsyncErrors(async (req,res,next) => {
    const member = await Member.findById(req.params.id);

    if(!member) return next(new ErrorHandler('Member not found',404));

    // Delete images on cloudinary
    for(let i = 0; i < member.avatar.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(member.avatar[i].public_id);
    }

    //delete nung mismong staff
    await member.remove();

    res.status(200).json({
        success: true,
        message: 'Member successfully removed.'
    })
})

// Create Member Review
exports.createMemberReview = catchAsyncErrors(async (req,res,next) =>{
    const { rating, comment, memberId, user} = req.body

    const review = {
        user : user._id,
        name : user.name,
        rating : Number(rating),
        comment : swearjar.censor(comment)

    }

    const member = await Member.findById(memberId)

    const isReviewed = member.reviews.find(
        r => r.user.toString() === user._id.toString()
    )

    if(isReviewed){
        member.reviews.forEach(review => {
            if(review.user.toString() === user._id.toString()) {
                review.comment = swearjar.censor(comment);
                review.rating = rating;
            }
        })
    } else {
        member.reviews.push(review);
        member.numOfReviews = member.reviews.length
    }

    member.ratings = member.reviews.reduce((acc,item) => item.rating + acc, 0) / member.reviews.length

    const actorReview = await member.save({validateBeforeSave : false});

    res.status(200).json({
        success:true,
        message: 'Member Updated',
        reviews: actorReview.reviews
    })

})

//Delete Member review => /api/v1/persons/reviews?id
exports.deleteMemberReview = catchAsyncErrors(async (req,res,next) => {
    member = await Member.findById(req.query.memberId);

    const reviews = member.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const ratings = member.reviews.reduce((acc,item) => item.rating + acc, 0) / member.reviews.length

    await Member.findByIdAndUpdate(req.query.memberId, {
        reviews,
        ratings
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message:'Successfully deleted.'
    })

})

//get all members for search function => /api/v1/members/all/names
exports.getAllMemberNames = catchAsyncErrors(async (req,res,next) => {
    // const names = await Member.distinct('name');
    const names = await Member.find().where('role', req.query.role).distinct('name')
    const name_id = await Member.find().where('role', req.query.role)


    res.status(200).json({
        success:true,
        message:'All members in the Data.',
        names,
        name_id: name_id.map(name => { 
            return {
                _id:name._id, 
                name: name.name, 
                title:name.name.concat(` - ${name._id}`),
                role:name.role
            }
        })

    })
})



