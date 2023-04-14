const jwt=require('jsonwebtoken')
const community=require('../models/community')
const member=require('../models/member')
module.exports=(req,res,next)=>{
    const admin=req.cookies.User
    let comm_admin
    jwt.verify(admin,process.env.PRIVATE_KEY,{},(err,result)=>{
        comm_admin=result.id
    })
    const mem_id=req.params.id
    let comm_id

    member.find({id:mem_id}).then((data)=>{
      comm_id=data[0].community
      community.find({id:comm_id,owner:comm_admin}).then((data)=>{
        if(data.length>0){
         next()
        }
        else{
            res.json({
                "status":false,
                "error":"NOT_ALLOWED_ACCESS"
            })
        }
    })
    }) 
}