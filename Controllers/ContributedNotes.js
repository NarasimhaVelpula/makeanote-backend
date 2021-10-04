const User=require('../Models/User')
const ContributedNotes=require('../Models/ContributedNotes')
const jwt=require('jsonwebtoken')

const createContributionNotes=async(req,res)=>{
    const email=req.email
    const {id}=req.body
    if(email){
        const findUser=await User.findOne({email:email})
        const notes=findUser.notes.splice(id,1)
        if(notes)
        {
        const newContributionNotes=new ContributedNotes({
            owner:email,
            notes:notes
        })  
        const savedNotes=await newContributionNotes.save()
        findUser.ownedNotes.push(savedNotes._id)
        const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
        res.status(200).send({"msg":"Notes Added to COntribution"})
    }
    else{
        res.status(400).send({"msg":"Notes not found"})
    }
    }
    else{
        res.status(400).send({"msg":"User not found"})
    }
}


const getOwnedNotes=async(req,res)=>{
    const email=req.email
    if(email){
        const findUser=await User.findOne({email:email})
        const ownedNotes=findUser.ownedNotes
        
    if(ownedNotes){
        let sendingNotes=[]
       for(i=0;i<ownedNotes.length;i++){
           let note=await ContributedNotes.findById(ownedNotes[i])
           note && sendingNotes.push(note)
       }
        res.status(200).send(sendingNotes)
    }
    else{
        res.status(400).send({"msg":"User not found"})
    }
}
else{
    res.status(201).send([])
}
}

const getContributedNotes=async(req,res)=>{
    const email=req.email
    console.log("Getting COntributed Notes..")
    if(email){
        const findUser=await User.findOne({email:email})
        const ownedNotes=findUser.contributedNotes
        console.log(ownedNotes)
        if(ownedNotes){
        let sendingNotes=[]
        let noteAccess=[]
        for(i=0;i<ownedNotes.length;i++){
            let note=await ContributedNotes.findById(ownedNotes[i])
            note && note.Contributers.map(c=>{
                if(c.email==email){
                    noteAccess.push(c.access)
                }
            })
            note && sendingNotes.push(note)
        }
        res.status(200).send({sendingNotes,noteAccess})
    }
    else{
        res.status(201).send([])
    }
    }
}

const addContributers=async (req,res)=>{
    console.log("Adding Contributers")
    const email=req.email
    const {list,id,access}=req.body
    let note=await ContributedNotes.findById(id)
    console.log(note)
    if(note.owner===email){
    for(i=0;i<list.length;i++){
        let contributer={
            email:list[i].email,
            lastEdit:null,
            access:access,
            type:"User"
        }
        
        note.Contributers.push(contributer)
        let findEmail=list[i].email
        let requiredUser=await User.findOne({email:findEmail})
        console.log(requiredUser)
        requiredUser.contributedNotes.push(id)
        let updatedUser=await User.findByIdAndUpdate(requiredUser._id,requiredUser)

    }

    

    let updatedNote=await ContributedNotes.findByIdAndUpdate(id,note)

    res.status(200).send(updatedNote)
}
else{
    res.status(403).send("Unauthorised Access")
}

}

const addContributionLink=async(req,res)=>{
    console.log("AddingContributionLink.....")
    const email=req.email
    const {name,expiryTime,access,id}=req.body
    let note=await ContributedNotes.findById(id)
    console.log(note)

    //Creating JWT TOken For notes

    if(note.owner===email){
        let link={
            name:name,
            expiresTime:expiryTime,
            access:access,
            lastEdit:null,
            type:"Link"
        }
       
        let expDate=new Date(expiryTime)
        let cd=new Date()
       
        let expirySeconds=(expDate.getTime()-cd.getTime())%1000
      
        console.log("exipiryseconds",expirySeconds)
        let jwt_token=jwt.sign({id:id,name:name},process.env.LINK_TOKEN,{expiresIn:expirySeconds})
        link.link=jwt_token
        note.Links.push(link)
        let updatedNotes=await ContributedNotes.findByIdAndUpdate(id,note)
        res.status(200).send("localhost:3000/viewNotes/"+jwt_token)
    }
    else{
        res.status(403).send("UnAuthorized Access")
    }
}

const modifyContributerAccess=async(req,res)=>{
    console.log("Modifying Contributer Access.......")
    const email=req.email
    const {user,access,id}=req.body
    let note=await ContributedNotes.findById(id)
    if(note.owner===email){
       ///Nedd to write here
       console.log("changing access")
      let contributers=note.Contributers
     await contributers.map(async contributer=>{
            if(contributer.email===user){
                contributer.access=access
            }
      })
      let updatedNote=await ContributedNotes.findByIdAndUpdate(id,note)
      res.status(200).send("updated")
    }
    else{
        res.status(403).send("Not a Authorised User")
    }
}

const deleteContributionNotes=async(req,res)=>{
    console.log("Delete Contribution Notes")
    const email=req.email
    const {id}=req.body

    let note=await ContributedNotes.findByIdAndDelete(id)
    res.status(200).send("notes deleted")
}

const modifyLinkAccess=async(req,res)=>{
    console.log("modifying Link Access..")
    const email=req.email
    const {name,access,id}=req.body
    let note=await ContributedNotes.findById(id)
    console.log(name)
    if(note.owner===email){
        let links=note.Links
        await links.map(async(link)=>{
            if(link.name===name){
                link.access=access
            }
        })
        console.log(note)
        let updatedNote=await ContributedNotes.findByIdAndUpdate(id,note)
        res.status(200).send("Access Updated")
    }
    else{
        res.status(403).send("Not a Authorised User")
    }
}

const updateNotesByContributer=async(req,res)=>{
    console.log("Updating Notes through Contributer..")
    const email=req.email
    const {Title,Context,id,Theme}=req.body
    const note=await ContributedNotes.findById(id)
    if(note){
        note.notes[0].Title=Title
        note.notes[0].Context=Context
        note.notes[0].Theme=Theme
       
        note.Contributers.map(c=>{
            if(c.email===email){
                c.lastEdit=Date.now()
            }
        })
        const updatedNote=await ContributedNotes.findByIdAndUpdate(id,note)
        res.status(200).send("Notes Updated")
    }
    else{
        res.status(403).send("unauthorised")
    }
}

const updateNotesByLink=async(req,res)=>{
    console.log("Updating Notes through Link--------")
    const {Title,Context,Theme,token}=req.body
    try{
    console.log(token)
    if(token){
        const verified=jwt.verify(token,process.env.LINK_TOKEN)
        if(verified){
            let id=verified.id
            let name=verified.name

        
    
    const note=await ContributedNotes.findById(id)
    if(note){
        note.notes[0].Title=Title
        note.notes[0].Context=Context
        note.notes[0].Theme=Theme
        note.Links.map(c=>{
            if(c.name===name){
                c.lastEdit=Date.now()
            }
        })
        const updatedNote=await ContributedNotes.findByIdAndUpdate(id,note)
        res.status(200).send("Notes Updated..")
    }
    else{
        res.status(403).send("Unauthorised Access")
    }
}
}
else{
    res.status(403).send("Unauthorised Access")
}}
catch(err){
    res.status(200).send('notfound')
}
}

const getNotesByLink=async(req,res)=>{
    console.log("getting Notes By link")
    const {token}=req.body
    try{
    if(token){
        const verified=jwt.verify(token,process.env.LINK_TOKEN)
        if(verified){
            let id=verified.id
            let name=verified.name
            let access="read"
            let validName=false
            const note=await ContributedNotes.findById(id)
            note.Links.map(l=>{
                if(l.name===name){
                    access=l.access
                    validName=true
                }
            })
            if(validName){
            res.status(200).send({note:note.notes,access})
            }
            else{
                res.status(404).send("notfound")
            }
        }
        else{
            res.status(404).send("not found")
        }
    }
    else{
        res.status(404).send("not found")
    }
}
catch(err){
    res.status(404).send("notfound")
}

}

const deleteContributers=async(req,res)=>{
    console.log("...Deleting Contributers...")
    const {users,id}=req.body
    let email=req.email
    let note=await ContributedNotes.findById(id)
    if(note.owner===email){
        let contributers=note.Contributers
        let links=note.Links
        let newContributers=[]
        let newLinks=[]
        await contributers.map(async contributer=>{
            if(users.includes(contributer.email)){
                let requiredUser=await User.findOne({email:contributer.email})
                console.log(requiredUser)
                let ind=requiredUser.contributedNotes.findIndex(id)
                requiredUser.contributedNotes.splice(ind,1)
                let updateUser=await User.findByIdAndUpdate(requiredUser._id,requiredUser)
                return null
            }
            else{
                newContributers.push(contributer)
            }
        })
        await links.map(async link=>{
            if(users.includes(link.name)){
                return null
            }
            else{
                newLinks.push(link)
            }
        })
        console.log(newContributers)
        note.Contributers=newContributers
        note.Links=newLinks
        updatedNote=await ContributedNotes.findByIdAndUpdate(id,note)
        res.status(200).send("updated Contributers List")
    }
    else{
        res.status(403).send("Unauthorised")
    }
}

const getUsers=async(req,res)=>{
    console.log("Getting Users...")
    let email=req.email
    let id=req.body.id
    let note=await ContributedNotes.findById(id)
    let contributers=note.Contributers.map(n=>{
        return n.email
    })
    let userEmails=await User.find({}).select({ "email": 1, "_id": 0});
   console.log(contributers)
   filterEmails=await userEmails.filter(ob=>{
       console.log(ob)
        if(contributers.includes(ob.email) || ob.email==email){
            return null
        }
        else{
            return ob
        }
   })
  
    res.status(200).send(filterEmails)
}

const getContributers=async(req,res)=>{
    console.log("getting Contributers..")
    let email=req.email
    let id=req.body.id
    let note=await ContributedNotes.findById(id)
    res.status(200).send({contributers:note.Contributers,links:note.Links})
}

module.exports={createContributionNotes,
                getOwnedNotes,
                getContributedNotes,
                addContributers,
                modifyContributerAccess,
                updateNotesByContributer,
                deleteContributers,
                deleteContributionNotes,
                getUsers,
                getContributers,
                addContributionLink,
                modifyLinkAccess,
                getNotesByLink,
                updateNotesByLink
            }