const mongoose=require('mongoose')
const User=require('../Models/User')
const Note=require('../Models/Note')
const getAllNotes=async(req,res)=>{
    const email=req.email
    if(email){
        const findUser=await User.findOne({email:email})
        if(findUser){
            console.log("Notes for User")
            console.log(findUser.notes)
            res.status(200).send(findUser.notes)
        }
        else{
            res.status(400).send({msg:"No user found"})
        }
    }
    else{
        res.status(400).send({msg:"No user found"})
    }
}

const createNotes=async(req,res)=>{
    const email=req.email
    const {Context,Theme,Title}=req.body
    if(email){
        const findUser=await User.findOne({email:email})
        console.log("-----Creating New Notes for---------")
        console.log(findUser)
        if(findUser){
            const newNote={
                Title:Title,
                Context:Context,
                Theme:Theme
            }
            findUser.notes.push(newNote)
            const updatedNotes=await User.findByIdAndUpdate(findUser._id,findUser)
            res.status(200).send({"msg":"Notes created"})
        }
        else{
            res.status(300).send({"msg":"redirect to login page"})
        }
    }
}

const updateNoteContent=async(req,res)=>{
    const email=req.email
    const {Context,Title,id,Theme}=req.body
    console.log(id)
    console.log(Theme)
    console.log("Updating Notes Content....")
    if(email){
        const findUser=await User.findOne({email:email})
        if(findUser){
            findUser.notes[id].Context=Context
            findUser.notes[id].Title=Title
            findUser.notes[id].Theme=Theme
            const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
            console.log(updatedUser)
            res.status(200).send({"msg":"notes Updated"})
        }
        else{
            res.status(400).send({"msg":"Usernot found hacked"})
        }
    }
}





const deleteNotes=async(req,res)=>{
    const email=req.email
    const {id}=req.body
    if(email){
        if(id>=0){
            const findUser=await User.findOne({email:email})
            if(findUser){
                findUser.notes.splice(id,1)
                const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
                res.status(200).send(updatedUser)
            }
            else{
                res.status(400).send({"msg":"user Not found"})
            }
        }
        else{
            res.status(400).send({"msg":"id Not found"})
        }
    }
    else{
        res.status(400).send({"msg":"email Not found"})
    }
}

module.exports={getAllNotes,createNotes,updateNoteContent,deleteNotes}