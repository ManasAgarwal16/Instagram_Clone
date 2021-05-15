const dotenv = require('dotenv');
const express = require('express');
require('./model/userSchema')
require('./model/post');
const app = express();
const mongoose = require('mongoose');

const PORT = 5000;
dotenv.config({ path:'./config.env' });

require('./db/conn');


app.use(express.json());
app.use(require('./routers/auth'))
app.use(require('./routers/post'))
app.use(require('./routers/user'))



app.listen(PORT,()=>{
    console.log(`server is running at port: ${PORT}`);
})