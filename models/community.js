const mongoose=require('mongoose')
const model=new mongoose.Schema({
  id:{type:String},
  name:{type:String,required:[true,"Name field is empty"],minlength:2},
  slug:{type:String},
  owner:{type:String},
  created_at:{type:Date},
  updated_at:{type:Date}
})
model.set("toObject",{virtuals:true})
model.set("toJSON",{virtuals:true})
model.virtual('owners',{
  "ref":"User",
  localField:"owner",
  foreignField:"id"
})
module.exports=mongoose.model("Community",model)