const role=require('../models/role')
const {Snowflake}=require('@theinternetfolks/snowflake')
module.exports=(req,res,next)=>{
    role.find({name:"Community Admin"}).then((data)=>{
        if(data.length===0){
            const u=new role({
                id:Snowflake.generate(),
                name:"Community Admin",
                created_at:new Date(),
                updated_at:new Date()
            }).save().then(()=>{
                next()
            })
        }
        else{
            next()
        }
    })
}