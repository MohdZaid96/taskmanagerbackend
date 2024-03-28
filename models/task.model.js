const mongoose=require("mongoose")


const taskSchema=new mongoose.Schema({
    name:{type: String,required:true},
    email:{type: String,required:true},
    task:{type: String,required:true},
    desc:{type:String,required:true},
    
},{timestamps:true})

taskSchema.pre('update',(next)=>{
    if(this.isModified('role') && this.role==="completed"){
        this.timestamps=new Date();
    }
    next();
})

const TaskModel=mongoose.model("task",taskSchema);

module.exports={TaskModel};