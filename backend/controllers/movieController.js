const Movie = require('../models/movie');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const swearjar = require('swearjar');
const { query } = require('express');

//create a new movie => /api/v1/movies/create
exports.createMovie = catchAsyncErrors(async(req, res, next) => {
    let images = [];

    if(typeof req.body.images ==='string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let ImageLinks = [];

    for(let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder : 'posters'
        })

        ImageLinks.push ({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.posters = ImageLinks
    req.body.members = JSON.parse(req.body.members)

    const movie = await Movie.create(req.body);

    res.status(200).json({
        success:true,
        movie
    })

})

//get all movies => /api/v1/moviesyear
exports.getAllMovies = catchAsyncErrors(async (req,res,next) => {
    const resPerPage = 12;
    const moviesCount = await Movie.countDocuments();

    const apiFeatures = new APIFeatures(Movie.find(), req.query).search().filter()

    let movies = await apiFeatures.query;
    let filteredMoviesCount = movies.length;

    apiFeatures.pagination(resPerPage);
    movies = await apiFeatures.query;

    res.status(200).json({
        success:true,
        moviesCount,
        resPerPage,
        filteredMoviesCount,
        movies
    })
})


//Get single movie details => /api/v1/movies/:id
exports.getMovie = catchAsyncErrors(async (req,res,next)=> {
    const movie = await Movie.findById(req.params.id);

    if(!movie) return next(new ErrorHandler('Movie not Found', 404));

    res.status(200).json({
        success:true,
        movie
    })
})

//Update movie => /api/v1/movies/:id
exports.updateMovie = catchAsyncErrors(async (req,res,next)=>{
    let movie = await Movie.findById(req.params.id);

    if(!movie) return next(new ErrorHandler('Movie not Found', 404));

    let images = [];

    if(typeof req.body.posters === 'string') {
        images.push(req.body.posters)
    } else {
        images = req.body.posters
    }

    if(images !== undefined) {
        //Delete
        for(let i = 0; i < movie.posters.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(movie.posters[i].public_id)

        }

        let imageLinks = [];

        for(let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder : 'posters'
            })

            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.posters = imageLinks
        
    }
    req.body.members = JSON.parse(req.body.members)

    movie = await Movie.findByIdAndUpdate(req.params.id,req.body, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success:true,
        movie
    })


})

//delete movie
exports.deleteMovie = catchAsyncErrors(async (req,res,next) => {
    const movie = await Movie.findById(req.params.id);

    if(!movie) return next(new ErrorHandler('Movie not found',404));

    // Delete images on cloudinary
    for(let i = 0; i < movie.posters.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(movie.posters[i].public_id);
    }

    await movie.remove();

    res.status(200).json({
        success: true,
        message: 'Movie successfully removed.'
    })
})

// Create a new review => /api/v1/review
exports.createMovieReview = catchAsyncErrors(async (req,res,next) => {
    const { rating, comment, movieId, user } = req.body;
    
    const review = {
        user : user._id,
        name: user.name,
        rating: Number(rating),
        comment: swearjar.censor(comment)
    }

    const movie = await Movie.findById(movieId);
    console.log(movie);
    // Find will look through the array and check if user id exist
    const isReviewed = movie.reviews.find(
        r => r.user.toString() === user._id.toString()
    )

    if(isReviewed){
        movie.reviews.forEach(review => {
            if(review.user.toString() === user._id.toString()) {
                review.comment = swearjar.censor(comment);
                review.rating = rating;
            }
        })
    } else {
        movie.reviews.push(review);
        movie.numOfReviews = movie.reviews.length
    }

    movie.ratings = movie.reviews.reduce((acc,item) => item.rating + acc, 0) / movie.reviews.length

    const movieReview = await movie.save({validateBeforeSave : false});

    res.status(200).json({
        success:true,
        message:'On movie review succeeded.',
        reviews: movieReview.reviews
    })



})

// Delete movie review => /api/v1/reviews?id=<reviewID>&movieId=<movieId>
exports.deleteMovieReview = catchAsyncErrors(async (req,res,next) => {
    const movie = await Movie.findById(req.query.movieId);

    const reviews = movie.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const ratings = movie.reviews.reduce((acc,item) => item.rating + acc, 0) / movie.reviews.length

    await Movie.findByIdAndUpdate(req.query.movieId, {
        reviews,
        ratings
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
        message:'Review deleted.'
    })

})

//get all movie title for search function => /api/v1/movies/title
exports.getMovieTitles = catchAsyncErrors(async (req,res,next) => {
    const titles = await Movie.distinct('title');


    res.status(200).json({
        success:true,
        message:'Review Data.',
        titles
    })
})