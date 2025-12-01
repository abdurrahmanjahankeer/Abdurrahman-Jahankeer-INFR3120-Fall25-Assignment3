let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let User = new mongoose.Schema({
    username:
    {
        type:String,
        default:"",
        trim:true,
        required:'Username is required'
    },
    email:
    {
        type:String,
        default:"",
        trim:true,
        required:'email is required'
    },
    displayName:
    {
        type:String,
        default:"",
        trim:true,
        required:'displayName is required'
    },
    googleId:
    {
        type: String,
        default: "",
        trim: true
    },
    githubId:
    {
        type: String,
        default: "",
        trim: true
    },
    created:
    {
        type:Date,
        default:Date.now
    },
    updated:
    {
        type:Date,
        default:Date.now
    }
},
{
    collection:"user"
}
)
let options = { MissingPasswordError: 'Wrong/Missing Password' };
User.plugin(passportLocalMongoose, options);
module.exports.User = mongoose.model('User', User);