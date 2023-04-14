const mongoose=require('mongoose')
const {isEmail}=require('validator')
const model=new mongoose.Schema({
    id:{type:String},
   name:{required:[true,"Name is required"],type:String,minlength:2},
   email:{required:[true,"Email is required"], type:String,validate:[isEmail,"Email is invalid"],unique:true},
   password:{minlength:6,required:[true,"Enter Your Password"],type:String},
   created_at:{type:Date}
})
module.exports=mongoose.model("User",model)