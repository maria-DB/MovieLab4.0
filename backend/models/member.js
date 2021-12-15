const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name is Required']

    },
    role : {
        type : String,
        required: [true, 'Please select role for this person'],
        enum: {
            values: [
                'Actor',
                'Actress',
                'Director',
                'Producer',
            ],
            message: 'Select Role for this Person'
        }

    },
    info : {
        type: String,
        default: 'No Information yet.'
    },
    avatar : [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
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
module.exports = mongoose.model('Members', memberSchema);