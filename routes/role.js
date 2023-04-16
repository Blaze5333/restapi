const express=require('express')
const role=require('../models/role')
const router=express.Router()
const {Snowflake}=require('@theinternetfolks/snowflake')
router.post('/',(req,res)=>{
    const date=new Date();
    const name=req.body.name;
    const user=new role({
        id:Snowflake.generate(),
        name:name,
        created_at:date,
        updated_at:date
    })
    user.save().then((data)=>{
        res.status(200).json({
            "status":true,
            "content":{
                "data":{
                    id:data.id,
                    name:data.name,
                    created_at:data.created_at,
                    updated_at:data.updated_at
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

 router.get("/",(req,res)=>{
    const perPage=+req.query.perPage || 2;
    const page=+req.query.page || 1;
    let total
    role.find({}).then((data)=>{total=data.length})
    role.find({}).select("name id created_at updated_at").limit(perPage).skip(perPage*(page-1)).then((data)=>{
        
        res.status(200).json({
            "status":true,
            "content":{
                "meta":{
                    "total":total,
                    "pages":Math.ceil(total/perPage),
                    "page":page
                },
                "data":data.map((elem)=>{
                    return(
                    {
                        "id":elem.id,
                        "name":elem.name,
                        scopes:[
                            "member-get",
                            "member-add",
                            "member-remove"
                        ],
                        "created_at":elem.created_at,
                        "updated_at":elem.updated_at

                    })
                })
            }
        })
    }).catch((err)=>{
        res.json(err)
    })

 })
module.exports=router
