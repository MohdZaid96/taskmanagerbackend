const mongoose=require("mongoose");
require('dotenv').config();


const connection=mongoose.connect(`${process.env.DATABASE_URL}`).then((res)=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err);
})

module.exports={connection};