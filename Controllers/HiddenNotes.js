const User=require('../Models/User')

const isHiddenPasswordSet=async(req,res)=>{
    const email=req.email
    if(email){
        const findUser=await User.findOne({email:email})
        const hiddenPassword=findUser.hiddenNotesPassword
        if(hiddenPassword){
            res.status(200).send(true)
        }
        else{
            res.status(200).send(false)
        }
    }
    else{
        res.status(404).send("not found")
    }
}

const setHiddenPassword=async(req,res)=>{
    const email=req.email
    if(email){
        const findUser=await User.findOne({email:email})
        const hiddenPassword=req.body.password
        console.log(req.body)
        if(hiddenPassword){
            findUser.hiddenNotesPassword=hiddenPassword
            const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
            res.status(200).send("ok")
        }
        else{
            res.status(400).send("not found")
        }
    }
    else{
        res.status(400).send("not found")
    }
}

const checkPassword=async(req,res)=>{
    const email=req.email
    if(email){
        const findUser=await User.findOne({email:email})
        if(findUser.hiddenNotesPassword===req.body.password){
            res.status(200).send("ok")
        }
        else{
            res.status(403).send("not ok")
        }
        
    }
}

const hideNotes=async(req,res)=>{
    const email=req.email
    const {id}=req.body
    if(email){
        let findUser=await User.findOne({email:email})
        let notes=findUser.notes.splice(id,1)
        if(notes)
        {
            findUser.hiddenNotes.push(notes[0])
        }
        const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
        res.status(200).send("ok")
    }
    else{
        res.status(400).send({"msg":"Notes not found"})
    }
}

const unhideNotes=async(req,res)=>{
    const email=req.email
    const {id}=req.body
    if(email){
        let findUser=await User.findOne({email:email})
        let notes=findUser.hiddenNotes.splice(id,1)
        if(notes)
        {
            findUser.notes.push(notes[0])
        }
        const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
        res.status(200).send("ok")
    }
    else{
        res.status(400).send({"msg":"Notes not found"})
    }
}

const getHiddenNotes=async(req,res)=>{
    const email=req.email
    if(email){
        let findUser=await User.findOne({email:email})
        if(findUser.hiddenNotes){
            res.status(200).send(findUser.hiddenNotes)
        }
        else{
            res.status(400).send("notfound")
        }
    }
    else{
        res.status(400).send("not found")
    }
}

const deleteNotes=async(req,res)=>{
    const email=req.email
    const {id}=req.body
    if(email){
        let findUser=await User.findOne({email:email})
        let notes=findUser.hiddenNotes.splice(id,1)
       
        const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
        res.status(200).send("ok")
    }
    else{
        res.status(400).send({"msg":"Notes not found"})
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
            findUser.hiddenNotes[id].Context=Context
            findUser.hiddenNotes[id].Title=Title
            findUser.hiddenNotes[id].Theme=Theme
            const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
            console.log(updatedUser)
            res.status(200).send({"msg":"notes Updated"})
        }
        else{
            res.status(400).send({"msg":"Usernot found hacked"})
        }
    }
}

module.exports={isHiddenPasswordSet,setHiddenPassword,hideNotes,
    checkPassword,
    unhideNotes,
    deleteNotes,
    updateNoteContent,
    getHiddenNotes}