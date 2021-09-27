const mongoose=require('mongoose')
const UsersSchema=mongoose.Schema({
    email:{
        type:String
    }
})
module.exports=mongoose.model('Users',UsersSchema)