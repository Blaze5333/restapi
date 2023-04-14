const jwt=require('jsonwebtoken')
const community=require('../models/community')
module.exports=(req,res,next)=>{
    let comm_admin
    const comm=req.body.community
    
    if(!comm){
        res.json({
            "status":false,
            "error":"Community field is missing"
        })
    }
    const admin=req.cookies.User
    jwt.verify(admin,process.env.PRIVATE_KEY,{},(err,result)=>{
        comm_admin=result.id
    })

    console.log(comm_admin)
    community.find({id:comm,owner:comm_admin}).then((data)=>{
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
}