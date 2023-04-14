const express=require('express')
const router=express.Router();
const User=require('../models/user')
const bcrypt=require('bcrypt')
const {Snowflake}=require('@theinternetfolks/snowflake')
const jwt=require('jsonwebtoken');
const login_auth = require('../middleware/login_auth');
require('dotenv').config()
router.post('/signup',(req,res)=>{
    const name=req.body.name
    const email=req.body.email
    const password=req.body.password
    bcrypt.hash(password,10,(err,hashedPassword)=>{
        const u=new User({
            id:Snowflake.generate(),
            name:name,
            email:email,
            password:hashedPassword,
            created_at:new Date()
        }).save().then((data)=>{
          jwt.sign({name:data.name,email:data.email,created_at:data.created_at},process.env.PRIVATE_KEY,{},(err,token)=>{
            res.status(200).json({
                "status":true,
                "constent":{
                    "data":{
                        "id":data.id,
                        "name":data.name,
                        "email":data.email,
                        "created_at":data.created_at
                    },
                    "meta":{
                        "access_token":token
                    }
                }
            })
          })
        }).catch((err)=>{
            res.json({
                "status":false,
                "error":err
            })
        })
    })

})
router.post('/signin',(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    User.find({email:email}).then((data)=>{
        if(data.length>0){
            bcrypt.compare(password,data[0].password,(err,result)=>{
                if(result===true){
                    jwt.sign({"id":data[0].id,"email":data[0].email,"name":data[0].name,"created_at":data[0].created_at},process.env.PRIVATE_KEY,{},(err,tk)=>{
                      res.cookie("User",tk).status(200).json({
                        "status":true,
                        "content":{
                            "data":{
                              "id":data[0].id,
                              "name":data[0].name,
                              "email":data[0].email,

                              "created_at":data[0].created_at
                            },
                            "meta":{
                                "access_token":tk
                            }
                        }
                      })
                    })
                   
                }
                else{
                    res.json({
                        "status":false,
                        "error":"Invalid Password"
                    })
                }
            })
        }
        else{
            res.json({
                "status":false,
                "error":"You need to signup first"
            })
        }
    }).catch((err)=>{
        res.json({
            "status":"false",
            "error":err
        })
    })

})
router.get('/me',login_auth,(req,res)=>{
   if(req.cookies.User){
    jwt.verify(req.cookies.User,process.env.PRIVATE_KEY,{},(err,decodedInfo)=>{
        res.status(200).json({
            "status":true,
            "content":{
                "data":{
                    "id":decodedInfo.id,
                    "name":decodedInfo.name,
                    "email":decodedInfo.email,
                    "created_at":decodedInfo.created_at
                }
            }
        })
    })
   }
   else{
    res.json({
        "status":false,
        "error":"You need to sign in First"
    })
   }
})

module.exports=router;