const mongoose = require('mongoose')

const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Username is required']
    },
    email: {
        type:String,
        required: [true,'Email is required'],
        unique: [true, 'Email has already been taken'],
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    avatar: [
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
    role : {
        type : String,
        required: [true, 'Select role for this person'],
        enum: {
            values: [
                'Admin',
                'User',
            ],
            message: 'Select Role for this Person'
        }

    },
})

// Return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

module.exports = mongoose.model('User', userSchema);