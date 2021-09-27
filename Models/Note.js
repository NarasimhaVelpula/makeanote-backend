const mongoose=require('mongoose')

const noteSchema=mongoose.Schema({
    heading:{
        type:String,
        default:""
    },
    content:{
        type:Array,
        default:[]
    }
})