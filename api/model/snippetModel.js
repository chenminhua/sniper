var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Snippet = new Schema({
    author:{authorId:String, username:String, avatar_url:String, email:String},
    title: {type:String, required: true},
    syntax: {type:String, default:''},
    tags: [{type: String}],
    is_private: {type:Boolean, default:false},
    description: {type:String, default:""},
    content: {type:String, required:true},
    created_at: {type:Date, default: Date.now},
    updated_at: { type: Date, default: Date.now },
    read: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }

});

var snippetModel = mongoose.model('Snippet', Snippet);

exports.snippetModel = snippetModel;


