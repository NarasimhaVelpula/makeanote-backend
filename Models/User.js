const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    email:{
        type: String,
        required: true,
        
    },
    password:{
        type:String,
        required: true,

    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    notes:{
        type:Array,
        default:null
    },
    ownedNotes:{
        type:Array,
        default:null
    },
    hiddenNotesPassword:{
        type:String,
        default: null
    },
    hiddenNotes:{
        type:Array,
        default:null
    },
    contributedNotes:{
        type:Array,
        default:null
    }
})
module.exports= mongoose.model('User', userSchema)