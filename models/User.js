const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const userScheme = mongoose.Schema({
    name:{
        type: String,
        maxlength : 50
    },
    email: {
        type: String,
        trim: true,
        unique:1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength : 50
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
        type:Number
    }
})

userScheme.pre('save', function (next) {
    var user = this; //userScheme 가르킴

    // 비밀번호 바꿀 때만 비밀번호를 암호화 시킨다.
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userScheme.methods.comparePassword = function (plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userScheme.methods.generateToken = function (cb) {
    var user = this;
    console.log('user._id',user._id)

    //jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')//toHexString() 안쓰면 Expected "payload" to be a plain object error
    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

const User = mongoose.model('User', userScheme)
module.exports= { User } //다른곳에도 쓸수있게