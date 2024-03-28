const express=require("express");
const { connection } = require("./config/db");
const {UserModel}=require("./models/user.model");
const {TaskModel}=require("./models/task.model");
const cors=require("cors")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const logger=require("./Logger/logger");
const {limiter}=require("./Ratelimiter/rateLimiter")
require('dotenv').config();



const app=express();

app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000' 
    })
);

// logger.info("Start");
// logger.error("Error")
app.get("/",(req,res)=>{
    res.send("Base API");
})
const authentication=(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token)
    logger.info(token);

        if(!token){
            res.send("Login first")
        }
        else{
            jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
                if(err){
                    logger.error(err);
                    res.send("Invalid Token");
                }                 
                else{
                    req.user=decoded.user;
                    next();
                }
            })
        }
}

app.use(limiter);

app.post("/signup",async (req,res)=>{
    const {email,password,name}=req.body;
    try {
    await bcrypt.hash(password, 2, async function(err, hash) {
        if(err){
            res.send("Bcrypt error")
        }
        const user=new UserModel({
            email,
            password:hash,
            name
        })
       
        await user.save();       
        // console.log("SignUp sucess")
        logger.info("SignUp sucess")
        res.send({msg:"SignUp sucess"})
       
    })
    } catch (error) {
        //console.log(error);
        logger.error(error);
        res.send(error)
    } 
}); 

app.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    const user=await UserModel.findOne({email});
    if(user){
        const hashed=user.password;
        bcrypt.compare(password, hashed, function(err, result) {
            if(err){
                res.send("Login Failed")
                logger.error("Login Failed");
            }else{
                const token = jwt.sign({user}, process.env.SECRET_KEY)
                res.send({msg:"Login Succesful",token,name:user.name})

            }
        })
    }else{
        res.status(new error(404));
        logger.error("User Not Found!!! Register");
    }
});

app.post("/create",authentication,async(req,res) => {
        const {name,email,task,desc}=req.body;
        try {
            const newTask=new TaskModel({
                name,
                email,
                task,
                desc
            })

            await newTask.save();
            // console.log("task saved")
            logger.info("task saved")
            res.send({msg:"Created"})
            
        } catch (error) {
            logger.error(error);
            res.send(error);
        }

})

app.delete("/delete/:_id",authentication,async(req,res) => {
    const _id=req.params._id;
    try {
       
        await TaskModel.deleteOne({_id});
        //console.log("task deleted")
        logger.info("task deleted");
        res.send({msg:"Task Deleted"})
        
    } catch (error) {
      //  console.log("task deleted");
        logger.error("Task Deletion Failed");
        res.send({msg:"Task Deletion Failed"})

    }

})

app.get("/tasks",authentication,async(req,res) => {
    const user=req.user;
    if(user.role == "user"){
        try {
            const tasks=await TaskModel.find({email : user.email});
            //console.log("Tasks fetched for student");
            logger.info("Tasks fetched for student");
            res.send({msg:"Data fetched",data:tasks})
            
        } catch (error) {
            //console.log(error);
            logger.error(error);
            res.send({msg:"Error fetching tasks"})
        }
        

    }else{
        try {
            const tasks=await TaskModel.find();
            //console.log("Tasks all fetched ");
            logger.info("Tasks all fetched")
            res.send({msg:"Data fetched",data:tasks,role:user.role});
        } catch (error) {
            //console.log(error);
            logger.error(error);
            res.send({msg:"Error fetching tasks"})
        }
    } 
})

app.put("/updateTask/:_id",authentication,async(req,res) => {
    const _id=req.params._id
    try {
        await TaskModel.findOneAndUpdate({_id},
            req.body
        );
       // console.log("Task Updated")
        logger.info("Task Updated");
        res.send({msg:"Task Updated"})
    } catch (error) {
        //console.log("Task Update Failed")
        logger.error(error);
        res.send(error);
    }
   

})


app.listen(8080,async()=>{
    try {
        await connection;
        //console.log("Server live on 8080")
        logger.info("Server live on 8080")
    } catch (error) {
        //console.log(error);
        logger.error(error); 
    } 

})

