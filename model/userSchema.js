const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/webdev16/image/upload/v1621070944/no-user-profile-picture-hand-260nw-99335579_ttigid.jpg"
    },

    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

// Hashing Password
userSchema.pre('save',async function (next)
{
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
}); 


const User = mongoose.model("USER",userSchema);
module.exports = User;
// mongoose.model("User",userSchema)