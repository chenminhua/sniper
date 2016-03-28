var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
require('./snippetModel.js')
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var snippet = mongoose.model('Snippet').schema;

var User = new Schema({
    email: {type:String, required:true, unique:true},
    avatar_url: {type:String},
    username: {type:String, required: true, unique:true},
    password: {type:String, required: true},
    created_at: {type:Date, default: Date.now},
    //likes: [{id:String,title:String,authorname:String,author_avatar_url:String}],
    likes:[snippet],
    likes_count: {type:Number, required: true, default: 0},
    snippets_count: {type:Number, required:true, default:0},
    followers: [{userId:String, username:String, avatar_url:String}],
    following: [{userId:String, username:String, avatar_url:String}],
    followers_count: {type:Number, required: true, default:0},
    following_count: {type:Number, required: true, default: 0}
});

User.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);
            user.password = hash;
            next();
        })
    });
});

User.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if(err) return cb(err);
        cb(isMatch);
    })
};

var userModel = mongoose.model('User', User);




