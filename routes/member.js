const express=require('express')
const member=require('../models/member')
const {Snowflake}=require('@theinternetfolks/snowflake')
const checkAuth=require('../middleware/check-auth')
const  router=express.Router()
const community=require('../models/community')
const jwt=require('jsonwebtoken')
const check_auth2 = require('../middleware/check_auth2')
router.post('/',checkAuth,(req,res)=>{
    const role=req.body.role
    const user=req.body.user
    const community=req.body.community
    
    const u=new member({
        id:Snowflake.generate(),
        community:community,
        role:role,
        user:user,
        created_at:new Date()
    }).save().then((data)=>{
        res.json({
            "status":true,
            "content":{
                "data":{
                    "id":data.id,
                    "community":data.community,
                    "user":data.user,
                    "role":data.role,
                    "created_at":data.created_at
                }
            }
        })
    }).catch((err)=>{
        res.json({
            "status":false,
            "error":err
        })
    })
})
router.delete('/:id',check_auth2,(req,res)=>{
    member.deleteMany({id:req.params.id}).then(()=>{
        res.json({
            "status":true
        })
    })
})



module.exports=router