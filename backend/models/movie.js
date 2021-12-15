const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title:{
        type : String,
        required : [true, 'Title is Required'],
        trim : true, 
        maxlength : [100, '100 lang']
    },
    movieType : {
        type: String,
        required: [true, 'Please select type for this movie'],
        enum: {
            values: [
                'TV Show',
                'Film'
            ],
            message: 'Please select correct genre for movie'
        }
    },
    year : {
        type : Number,
        default : new Date().getFullYear()
    },
    date_released : {
        type : Number,
        default: Date.now
    },
    runtime : {
        type : Number,
        require : [true, 'Runtime is required']
    },
    posters : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],
    plot : {
        type : String,
        required: [true, 'Plot is Required']
    },
    members : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : 'Person',
                required : true
            },
            name : {
                type : String,
                required : [true, 'Insert Full name']
            },
            role : {
                type: String,
                required: [true, 'Please select role for this person'],
                enum: {
                    values: [
                        'Actor',
                        'Actress',
                        'Director',
                        'Producer',
                    ],
                    message: 'Please select correct role'
                }
            }
        }
    ],
    genre : {
        type: String,
        required: [true, 'Please select genre for this movie'],
        enum: {
            values: [
                'Horror',
                'Sci-Fi',
                'Drama',
                'Comedy',
                'War',
                'Sports',
                'Crime',
                'Action',
                'Musicals',
                'Romance',
            ],
            message: 'Please select correct genre for movie'
        }
    },
    ratings: {
        type: Number,
        default: 0
    },
    reviews : [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    created_at : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Movie', movieSchema);
