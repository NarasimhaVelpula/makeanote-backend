const mongoose=require('mongoose')
const contributedNotesSchema=mongoose.Schema({
    owner:{
        type:String,
        required:true
    },
    Contributers:{
        type:Array,
        defualt:null
    },
    Links:{
        type:Array,
        default:null
    },
    notes:{
        type:Object
    }


})

module.exports=mongoose.model('contributedNotes',contributedNotesSchema)