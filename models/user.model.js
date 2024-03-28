const mongoose=require("mongoose")


const userSchema=new mongoose.Schema({
    name:{type: String,required:true},
    email:{type: String,required:true},
    password:{type: String,required:true},
    role:{type:String,enum:["user","admin","manager"],default:"user"}
})

userSchema.pre('save',async (next)=>{
    if(this.role =="admin"){
        try {
            await this.constructor.deleteOne({ role: 'admin', _id: { $ne: this._id } });
            console.log("previous admin deleted");
        } catch (error) {
            console.log(error);
        }

    }
    next();
})

const UserModel=mongoose.model("user",userSchema);



module.exports={UserModel};