const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: [3,'User must min 3 length'],
        unique: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [6,'User must min 3 length'],
    },

    password: {
        type: String,
        required: true,
        minlength: [3,'User must min 3 length'],
    }
});

module.exports = mongoose.model('User', userSchema);