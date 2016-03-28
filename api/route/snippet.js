var mongoose = require('mongoose');
var snippetModel = mongoose.model('Snippet');
var userModel = mongoose.model('User');
var _ = require('underscore');

//当前热门snippet，按likes排序
exports.listhot = function (req, res) {
    snippetModel.find({}, null, {sort: {'likes': -1}}, function (err, snippets) {
        if (err) {
            console.log(err);
            return res.send(400);
        } else {
            return res.send(200, snippets);
        }
    })
};

//当前用户的所有snippet
exports.listUsersnippet = function (req, res) {
    username = req.params.username
    snippetModel.find({"author.username": username},null, {sort:{'created_at':-1}}, function (err, snippets) {  //按照时间线
        if (err) {
            console.log(err);
            return res.send(400);
        } else {
            return res.send(200, snippets);
        }
    })
};

//新建snippet
exports.create = function (req, res) {
    if (!req.user) {
        return res.send(401)
    }

    var snippet = req.body.snippet;
    if (snippet == null || snippet.title == null || snippet.content == null || snippet.tags == null) {
        return res.send(400);
    }
    var newSnippet = new snippetModel();     //待封装

    userModel.findOne({'_id': req.user.id}, function (err, user) {
        if (!user) {
            return res.send(400);
        }

        newSnippet.author = {
            authorId: user._id,
            username: user.username,
            avatar_url: user.avatar_url,
            email: user.email
        }
        newSnippet.title = snippet.title;
        newSnippet.description = snippet.description;
        newSnippet.tags = snippet.tags.split(',');
        newSnippet.is_private = snippet.is_private;
        newSnippet.content = snippet.content;
        newSnippet.syntax = snippet.syntax;
        console.log(newSnippet)
        newSnippet.save(function (err) {
            if (err) {
                console.log(err);
                return res.send(400);
            }
            user.snippets_count += 1;
            user.save()
            return res.send(200, {status: "create success"});
        });
    });
};

//更新snippet
exports.update = function (req, res) {
    if (!req.user) {
        return res.send(401)       //无登陆用户
    }
    if (!req.body.snippet) {
        return res.send(400)        //无参数传上来
    }
    var snip = req.body.snippet
    var id = snip.snippetId || '';
    snippetModel.findOne({'_id': id}, function (err, snippet) {
        if (!snippet) {
            return res.send(400)    //没有这个snippet
        }
        if (req.user.id !== snippet.author.authorId) {
            return res.send(400)     //当前用户没有权限
        }
        snippet.title = snip.title;
        snippet.syntax = snip.syntax;
        snippet.content = snip.content;
        snippet.tags = snip.tags.split(',');
        console.log(snippet.tags)
        snippet.description = snip.description;
        snippet.save(function (err) {
            if (err) {
                console.log(err);
                return res.send(400);
            }
            return res.send(200, {status: "update success"});
        })

    })

}

//收藏
exports.like = function (req, res) {
    var id = req.params.snippetId || '';
    if (id == '') {
        return res.send(400);
    }
    snippetModel.findOne({_id: id}, function (err, snippet) {
        if (err) {
            return res.send(400);
        }
        userModel.findOne({_id: req.user.id}, function (err, user) {
            if (_.where(user.likes, {_id: snippet.id}).length != 0) {
                return res.send(400, {status: "has been liked by you"})
            }

            snippet.likes += 1;
            snippet.save();


            console.log(snippet)
            user.likes.push(snippet);
            user.likes_count += 1;
            user.save();

            res.send(200);
        })
    })
};

//取消收藏
exports.unlike = function (req, res) {
    var id = req.params.snippetId || '';
    if (id == '') {
        return res.send(400);
    }
    snippetModel.findOne({_id: id}, function (err, snippet) {
        if (err) {
            return res.send(400, {"status": "no such snippet"})
        }
        if(snippet){
            userModel.findOne({_id: req.user.id}, function (err, user) {
                for (i in user.likes) {
                    if (snippet._id.toString() == user.likes[i]._id.toString()) {
                        user.likes.splice(i, 1)
                        user.likes_count -= 1;
                        snippet.likes -= 1;
                        user.save()
                        snippet.save()
                        return res.send(200);
                    }
                }
                return res.send(400, "you haven't like this snippet")
            })
        }else{
            //这个snippet已经被删除了
            userModel.findOne({_id: req.user.id}, function (err, user) {
                for (i in user.likes) {
                    if (id == user.likes[i]._id.toString()) {
                        user.likes.splice(i, 1)
                        user.likes_count -= 1;
                        user.save()
                        return res.send(200);
                    }
                }
                return res.send(400, "you haven't like this snippet")
            })
        }

    })
};

//删除snippet
exports.delete = function (req, res) {
    var id = req.params.snippetId || '';
    if (id == '') {
        return res.send(400);
    }
    snippetModel.findOne({_id: id}, function (err, snippet) {
        if (err) {
            return res.send(400, {"status": "no such snippet"})
        }
        if (snippet.author.authorId === req.user.id) {
            snippet.remove();
            userModel.findOne({_id:req.user.id}, function(err,user){
                user.snippets_count -= 1
                user.save()
            })
            return res.send(200, {"status": "delete successfully"})
        } else {
            return res.send(400, {"status": "you don't have the premission"})
        }
    })
};

exports.listByTag = function (req, res) {

};

exports.viewById = function (req, res) {
    var userId = req.headers.userid || ''

    var id = req.params.snippetId;
    snippetModel.findOne({_id: id}, function (err, snippet) {
        if (err) {
            console.log(err);
            return res.send(400, {"status": "mongodb query problem"});
        }
        var isOwner = false;
        var isStarred = "";
        if (snippet) {
            if(userId == snippet.author.authorId){
                isOwner = true;
            }
            if(userId == ""){
                return res.send(200, {snippet: snippet,isOwner:isOwner,isStarred:isStarred})
            }else{
                isStarred = false
                userModel.findOne({_id:userId}, function(err, user){
                    for (var i= 0, len=user.likes.length; i<len;i++){
                        if(user.likes[i].id == snippet._id){
                            isStarred = true;
                            break;
                        }
                    }
                    return res.send(200,{snippet: snippet,isOwner:isOwner,isStarred:isStarred})
                })
            }
        } else {
            return res.send(400, {"status": "no this snippet"})
        }
    })
};

exports.listTagHot = function (req, res) {

};