const mongoose=require('mongoose')
const model=new mongoose.Schema({
  id:{type:String},
  community:{type:String,required:[true,"Coummunity id is missing"]},
  user:{type:String,required:[true,"User id is missing"]},
  role:{type:String,required:[true,"Role id is missing"]},
  created_at:{type:Date}
})
model.set('toObject',{virtuals:true})
model.set('toJSON',{virtuals:true})
model.virtual('communities',{
    "ref":"Community",
    localField:"community",
    foreignField:"id"
})
model.virtual('users',{
    "ref":"User",
    localField:"user",
    foreignField:"id"
})
model.virtual('roles',{
    "ref":"Role",
    localField:"role",
    foreignField:"id"
})
module.exports=mongoose.model("Member",model)