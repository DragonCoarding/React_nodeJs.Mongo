const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');
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

userSchma.pre('save',function(next){
    var user = this;
    if(user.isModified('password')) {
        //비밀번호를 암호화시키고 index의 save 함수로 보냄
        bcrypt.genSalt(saltRounds,function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password,salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    } 
})


userSchma.methods.comparePassword = function(plainPassword, cb){

    // plainPassword 12341234 , 암호화된 비밀번호 $2b$10$ZCmr2Hrk02OnMbhpCV2KvuTpEG7jhGeaewkyEbrPjHWlO/SSvlA2G
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchma.methods.makeToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하깅!
    var token = jwt.sign(user._id.toHexString(),'secret')

    // user._id + 'secretToken' = token

    // ->

    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    })
}


userSchma.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode 함
    jwt.verify(token, 'secret', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchma) // 모델로 감싸주기  모델이름 , 스키마이름

module.exports = { User }