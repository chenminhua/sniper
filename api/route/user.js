var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var redisClient = require('../config/redis_database').redisClient;
var tokenManager = require('../config/token_manager');
var gravatar = require('gravatar');
var _ = require('underscore');

//登陆
module.exports.signin = function(req,res){
    var username= req.body.username || '';
    var password = req.body.password || '';
    if(username == '' || password == ''){
        return res.send(401);
    }

    userModel.findOne({username:username}, function(err, user){
        if(err){
            console.log(err);
            res.send(401);
        }
        if(user == undefined){
            res.send(401);
        }

        user.comparePassword(password, function(isMatch){
            if(!isMatch){
                return res.send(401);
            }
            //生成token，30天过期
            var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
            return res.json({token:token,user:user});
        })
    })
};

//注销登陆
module.exports.logout = function (req, res) {
    if(req.user){
        tokenManager.expireToken(req.headers);
        delete req.user;
        return res.send(200);
    }else{
        return res.send(401);
    }
}

//注册新用户
module.exports.register = function (req, res) {
    var email = req.body.email || '';
    var username = req.body.username || '';
    var password = req.body.password || '';
    var passwordConfirmed = req.body.passwordConfirmed || '';

    if (username == '' || password == '' || password != passwordConfirmed){
        return res.send(400);
    }

    var user = new userModel();
    var avatar_url = gravatar.url(email, {s:'50',r:'G', d:'retro'});
    user.avatar_url = "http://cn" +  avatar_url.substring(5);
    user.username = username;
    user.password = password || '';
    user.email = email || '';

    user.save(function(err, counter){
        if(err){
            console.log(err);
            return res.send(500);
        }
        var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
        return res.json({token:token,user:user});
    })
};

//follow新用户
module.exports.follow = function(req, res){
    var username = req.params.username
    if (!req.user){
        return res.send(401)
    }
    userModel.findOne({username:username}, function(err,user){
        //找到被follow的人，把自己加入到他的followers中去，并把他加入到自己的following中去
        userModel.findOne({_id:req.user.id},function(err,me){
            for (var i = 0, len = me.following.length; i < len; i++){
                if(me.following[i].userId == user._id){
                    return res.send(400,{status:"you already followed this user"})
                }
            }
            user.followers.unshift({userId:me._id, username:me.username, avatar_url:me.avatar_url});
            me.following.unshift({userId:user._id, username:user.username, avatar_url:user.avatar_url});
            me.following_count += 1;
            user.followers_count += 1;
            user.save(function(err,counter){
                if(err) return res.send(500);
                me.save(function(err,counter){
                    if (err) return res.send(500);
                    return res.send(200, {status: "follow success"})
                })
            })
        })
    })

}

//unfollow新用户
module.exports.unfollow = function(req, res){
    var username = req.params.username
    if (!req.user){
        return res.send(401)
    }
    userModel.findOne({username:username}, function(err,user){
        //找到要unfollow的那个人，然后把他移除me的following，并把自己从他的followers中移除
        userModel.findOne({_id:req.user.id},function(err,me){
            var i = 0, len = me.following.length;
            while(i < len){
                if (me.following[i].userId == user._id) break;
                i++;
            }
            if (i==len){
                return res.send(400, {status:"you haven't follow this user"})
            }else{
                user.followers.splice(i,1);
                me.following = _.filter(user.following, function(following){if(following.userId == me._id){return false;}});
                user.followers_count -= 1;
                me.following_count -= 1;
            }


            user.save(function(err,counter){
                if(err) return res.send(500);
                me.save(function(err,counter){
                    if (err) return res.send(500);
                    return res.send(200, {status: "unfollow success"})
                })
            })
        })
    })
}

//用户信息
module.exports.getUser = function(req, res){
    var userId = req.headers.userid || "";
    console.log(req.headers.userid);
    var username = req.params.username;

    userModel.findOne({username:username}, function(err, user){
        if (err) return res.send(404, {status: "no this user"});

        var isfollowed = "";
        if(userId == ""){
            user.password = undefined;
            user.followers = undefined;
            user.following = undefined;
            return res.send(200,{user:user,isfollowed:isfollowed});
        }
        isfollowed = false;
        for (var i = 0, len=user.followers.length; i<len;i++){
            if (user.followers[i].userId == userId){
                isfollowed = true;
                break;
            }
        }
        return res.send(200,{user:user,isfollowed:isfollowed})
    })
};

module.exports.getfollower = function(req, res){
    if(!req.user){
        userModel.findOne({username:req.params.username}, function(err, user){
            if (err) return res.send(500, {status: "no matched user"})
            return res.send(200, {followers: user.followers})
        })
    }else{
        userModel.findOne({_id:req.user.id}, function(err, user){
            if(err) return res.send(500, {status: "no matched user"})
            return res.send(200, {followers: user.followers})
        })
    }
};

module.exports.getfollowing = function(req, res){
    if(!req.user){
        userModel.findOne({username:req.params.username}, function(err, user){
            if (err) return res.send(500, {status: "no matched user"});
            return res.send(200, {following: user.following})
        })
    }else{
        userModel.findOne({_id:req.user.id}, function(err, user){
            if(err) return res.send(500, {status: "no matched user"})
            return res.send(200, {following: user.following})
        })
    }
};


module.exports.getlikes = function(req, res){
    if(!req.user){
        userModel.findOne({username:req.params.username}, function(err,user){
            if (err) return res.send(500, {status: "no matched user"});
            return res.send(200, {likes: user.likes})
        })
    }else{
        userModel.findOne({_id:req.user.id}, function(err, user){
            if(err) return res.send(500, {status: "no matched user"})
            return res.send(200, {likes: user.likes})
        })
    }
};



