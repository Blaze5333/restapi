const express=require('express');
const router=express.Router()
const community=require('../models/community')
const {Snowflake}=require('@theinternetfolks/snowflake')
require('dotenv').config()
const jwt=require('jsonwebtoken')
const lodash=require('lodash')
const member=require('../models/member')
const role=require('../models/role')
const checkRole=require('../middleware/check_role');
const login_auth = require('../middleware/login_auth');
router.post('/',checkRole,login_auth,async(req,res)=>{
    const name=req.body.name
    const communityId=Snowflake.generate()
    const slug=lodash.camelCase(name)
    let owner

    jwt.verify(req.cookies.User,process.env.PRIVATE_KEY,{},(err,info)=>{
     owner=info.id
    })
    role.find({name:"Community Admin"}).then((data)=>{
        new member({
            id:Snowflake.generate(),
            user:owner,
            role:data[0].id,
            community:communityId
        }).save().then(()=>{
            const d=new community({
                name:name,
                slug:slug,
                id:communityId,
                owner:owner,
                created_at:new Date(),
                updated_at:new Date()
            }).save().then((data1)=>{
                res.status(200).json({
                    "status":true,
                    "content":{
                        "data":{
                            "id":data1.id,
                            "name":data1.name,
                            "slug":data1.slug,
                            "owner":data1.owner,
                            "created_at":data1.created_at,
                            "updated_at":data1.updated_at
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
    })
   
  })

router.get("/",(req,res)=>{
    const perPage=+req.query.perPage || 2
    const page=+req.query.page || 1
    let total
    community.find({}).then((data)=>{
    total=data.length
    })
    community.find({}).populate("owners").limit(perPage).skip((page-1)*perPage).then((data)=>{
       
        res.json({
        "status":true,
        "content":{
            "meta":{
                "total":total,
                "pages":Math.ceil(total/perPage),
                "page":page
            },
            "data":data.map((elem)=>{
                return ({
                    "id":elem.id,
                    "name":elem.name,
                    "slug":elem.slug,
                    "owner":{
                        "id":elem.owners[0].id,
                        "name":elem.owners[0].name
                    },
                    "created_at":elem.created_at,
                    "updated_at":elem.updated_at
                })
            })
        }
       }) 
    })
})
router.get('/:id/members',(req,res)=>{
    const comm_id=req.params.id
    const perPage=+req.query.perPage || 1
    const page=+req.query.page || 1 
    let total
    member.find({community:comm_id}).then((data1)=>{
        total=data1.length
    })
    member.find({community:comm_id}).populate("users").populate("roles").limit(perPage).skip((page-1)*perPage).then((data)=>{
        res.json({
            "status":true,
            "content":{
                "meta":{
                    "total":total,
                    "pages":Math.ceil(total/perPage),
                    "page":page
                },
                "data":data.map((elem)=>{
                    return ({
                        "id":elem.id,
                        "community":elem.community,
                        "user":{
                            "id":elem.users[0].id,
                            "name":elem.users[0].name
                        },
                        "role":{
                            "id":elem.roles[0].id,
                            "name":elem.roles[0].name
                        },
                        "created_at":elem.created_at,
                        
                    })
                })
            }
           }) 

    }).catch((err)=>{
        res.json({
            "status":false,
            "error":err
        })
    })
})
router.get('/me/owner',login_auth,(req,res)=>{
    const perPage=+req.query.perPage || 2
    const page=+req.query.page || 1
    const comm_admin=req.cookies.User
    let comm_admin_id
    jwt.verify(comm_admin,process.env.PRIVATE_KEY,{},(err,result)=>{
        comm_admin_id=result.id
    })
    let total
    community.find({owner:comm_admin_id}).then((data)=>{
        total=data.length
    })
    community.find({owner:comm_admin_id}).limit(perPage).skip((page-1)*perPage).then((data)=>{
        res.json({
            "status":true,
            "content":{
                "meta":{
                    "total":total,
                    "pages":Math.ceil(total/perPage),
                    "page":page
                },
                "data":data.map((elem)=>{
                    return ({
                        "id":elem.id,
                        "name":elem.name,
                        "slug":elem.slug,
                        "owner":elem.owner,
                        "created_at":elem.created_at,
                        "updated_at":elem.updated_at
                    })
                })
            }
           }) 
    }).catch((err)=>{
        res.json({
            "status":false,
            "error":err
        })
    })
})
router.get("/me/member",login_auth,(req,res)=>{
    const perPage=+req.query.perPage || 2
    const page=+req.query.page || 1
    const comm_admin=req.cookies.User
    let user_id
    jwt.verify(comm_admin,process.env.PRIVATE_KEY,{},(err,result)=>{
        user_id=result.id
    })
    
 member.find({user:user_id}).populate({
        path:"communities",
        populate:{
            path:"owners",
            model:"User"
        }
    }).then((data)=>{
        const total=data.length
        res.json({
            "status":true,
            "content":{
                "meta":{
                    "total":total,
                    "pages":Math.ceil(total/perPage),
                    "page":page
                },
                "data":data.map((elem)=>{
                    let full_data;
                     full_data={
                            "id":elem.id,
                            "name":elem.communities[0].name,
                            "slug":elem.communities[0].slug,
                            "owner":{
                                "id":elem.communities[0].owners[0].id,
                                "name":elem.communities[0].owners[0].name
                            },
                            "created_at":elem.created_at,
                            "updated_at":elem.updated_at
                        }
                    return(full_data)
                })
            }
        })
    })
})
module.exports=router
