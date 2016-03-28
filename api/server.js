var express = require('express');
var app = express();
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var secret = require('./config/secret');
var tokenManager = require('./config/token_manager');
mongoose.connect('mongodb://localhost/sniper_test', function(err,res){
    if(err){
        console(err)
    }else{
        console.log('connection successful to mongo')
    }
});

require('./model')

var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(bodyParser())

var routes = {};
routes.user = require('./route/user');
routes.snippet = require('./route/snippet');

app.all('*', function(req, res, next) {
    //res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, UserId');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

app.post('/user/register', routes.user.register);

app.post('/user/signin', routes.user.signin);

app.get('/user/logout', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.user.logout);

app.get('/snippet/hot', routes.snippet.listhot);

app.get('/snippet/hot/:tagname', routes.snippet.listTagHot );

app.get('/user/:username/snippet', routes.snippet.listUsersnippet);

app.get('/snippet/tag/:tagname', routes.snippet.listByTag);

app.get('/snippet/id/:snippetId', routes.snippet.viewById);

app.post('/snippet', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.snippet.create);

app.put('/user/likes/:snippetId', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.snippet.like);

app.delete('/user/likes/:snippetId', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.snippet.unlike);

app.delete('/snippet/:snippetId', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.snippet.delete);

app.put('/snippet',jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.snippet.update);

app.put('/user/following/:username',jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.user.follow);

app.delete('/user/following/:username',jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.user.unfollow);



app.get('/user/:username', routes.user.getUser);


app.get('/user/:username/followers', routes.user.getfollower);

app.get('/user/:username/following', routes.user.getfollowing);

app.get('/followers', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.user.getfollower);

app.get('/following', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.user.getfollowing);

app.get('/user/:username/likes', routes.user.getlikes);

app.get('/likes', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.user.getlikes);



app.listen(7000, function(){
    console.log("listen on 7000")
});

