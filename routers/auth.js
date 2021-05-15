const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const User = require("../model/userSchema");
// const User = mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendinBlueTransport = require('nodemailer-sendinblue-transport');


const transporter = nodemailer.createTransport(sendinBlueTransport({
    host:process.env.SMTP_HOST,
        // api_key:"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"
        port:process.env.SMTP_PORT,
    auth:{
        user:process.env.MAIL_USER,
        password:process.env.MAIL_PASS        

    }
}))



router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user");
})

// Register
router.post('/signup',async(req,res)=>{
    const {name,email,password,pic}= req.body
    if(!email || !password || !name)
    {
        res.status(422).json({error:"Please add all the fields"})
    }
    try
    {
        const userExist = await  User.findOne({email:email});
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        }
        const user = new User({name,email,password,pic});
        const userRegister = await user.save();
        if (userRegister) {
            await transporter.sendMail({
                to:user.email,
                from:"no-reply@insta.com",
                subject:"signup success",
                html:"<h1>Welcome to InstaClone </h1>"
            })
            res.status(201).json({ message: "User registered Successfully" });
        }
        else {
            res.status(500).json({ error: "Failed to register" })
        }
    }
    catch(err)
    {
        console.log(err);
    }
   
})


// Login
router.post('/signin', async(req,res)=>{
    try
    {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Empty plz fill" })
        }
        const userLogin = await User.findOne({ email: email });
        console.log(userLogin);
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {
                res.status(400).json({ message: "Invalid Credentials pass" })

                
            }
            else {

                const token = jwt.sign({_id:userLogin._id},process.env.SECRET_KEY)
                const {_id,name,email,followers,following,pic} = userLogin
                res.json({token,user:{_id,name,email,followers,following,pic}})

                // res.json({ message: "User sign in Successfully" })
            }
        }
        else
        {
            res.status(400).json({ error: "Invalid Credentials" })
        }  
    }
    catch (err) {
        console.log(err);
    } 
    });

module.exports= router;