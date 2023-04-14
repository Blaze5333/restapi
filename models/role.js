const mongoose=require('mongoose')
const validator=require('validator')
const model=new mongoose.Schema({
    id:{type:String},
    name:{type:String,required:[true,"Name is required"],unique:[true,"Name should be Unique"]},
    created_at:{type:Date},
    updated_at:{type:Date}

})
module.exports=mongoose.model("Role",model)