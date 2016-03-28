var redisClient = require('./redis_database').redisClient;

var TOKEN_EXPIRATION = 60 * 24 * 30;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

exports.verifyToken = function(req,res,next){
    var token = getToken(req.headers);
    console.log(token)
    redisClient.get(token, function(err, reply){
        if(err){
            console.log("token vertified error, please check your redis connection ");
            console.log(err);
            return res.send(500);
        }
        console.log(reply)
        if(reply){
            console.log("ahoh, token has  been expired");
            res.send(401);
        }else{
            console.log("the token has not been expired");
            next();
        }
    });
};

exports.expireToken = function(headers){
    var token = getToken(headers);

    if (token != null){
        redisClient.set(token, token);
        redisClient.expire(token, TOKEN_EXPIRATION_SEC);
    }
}

var getToken = function(headers){
    if(headers && headers.authorization){
        var authorization = headers.authorization;
        var part = authorization.split(' ');

        if(part.length == 2){
            var token = part[1];
            return token;
        }
        else {
            return null;
        }
    }
    return null;
};

exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
