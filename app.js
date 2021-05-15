const dotenv = require('dotenv');
const express = require('express');
require('./model/userSchema')
require('./model/post');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
dotenv.config({ path:'./config.env' });

require('./db/conn');


app.use(express.json());
app.use(require('./routers/auth'))
app.use(require('./routers/post'))
app.use(require('./routers/user'))


if(process.env.NODE_ENV=="production")
{
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,()=>{
    console.log(`server is running at port: ${PORT}`);
})