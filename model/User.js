const mongoose = require('mongoose');
const userSchma = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    role:{
        type: Number,
        default: 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User', userSchma) // 모델로 감싸주기  모델이름 , 스키마이름

module.exports = { User }