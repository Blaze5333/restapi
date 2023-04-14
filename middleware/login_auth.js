const jwt=require('jsonwebtoken')
const user=require('../models/user')
const bcrypt=require('bcrypt')
module.exports=(req,res,next)=>{

let result
   jwt.verify(req.cookies.User,process.env.PRIVATE_KEY,{},(err,result)=>{
    email=result.email
   })
   user.find({email:email}).then((data)=>{
    if(data.length>0){
        next()
    }
    else{
        res.json({
            "status":false,
            "error":"please login first"
        })
    }
   })
}