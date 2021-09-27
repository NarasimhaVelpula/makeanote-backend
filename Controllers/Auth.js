const mongoose=require('mongoose')
const Users=require('../Models/Users')
const User=require('../Models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const path=require('path')
const {verficationMail,forgotPasswordMail}=require('./Templates/mailHandler')

const { find } = require('../Models/User')

const register=async (req,res)=>{
    const email= req.body.email;
    const password= req.body.password;

    console.log("-------Registering User------------")
    //Checking Wheather User Exists or not
    const emailExists= await Users.findOne({email:email})
    if(emailExists){
        console.log("Email exists in the database, Returning the Same")
        res.status(400).send("Email already Exists")
        return;
    }

    //Password Encryption
    console.log("Password Encrypting for registering User")
    const salt= await bcrypt.genSalt(9);
    const hashedPassword= await bcrypt.hash(password,salt)

    //New User Creation
    console.log("New User creation for registering User")
    const newUser= new User({
        email:email,
        password:hashedPassword,

    })
    try{
        const savedUser=await newUser.save()
        console.log("User Created, Verification Email need to be send")
        res.status(300).send({vefication:true})
        
        verficationMail(email)
    }
    catch(err){
        console.log(err)
        res.status(400).send("Something wrong with server")
    }

}

const verifyingUserEmail=async(req,res)=>{
    console.log("Came to verifying Email")
    const user=req.params.user;
    try{
    const {email}=jwt.verify(user,process.env.EMAIL_TOKEN)
    
    const requiredUser=await User.findOne({email:email})
    if(requiredUser){
        requiredUser.emailVerified=true;
        const updatedUser=await User.findByIdAndUpdate(requiredUser._id,requiredUser)
        res.status(200).redirect('https://makeanote.vercel.app/')
    }
    else{
        res.status(200).sendFile(path.join(__dirname+"/templates/linkNotfound.html"))
    }
}
catch(err){
    res.status(200).sendFile(path.join(__dirname+"/templates/linkNotfound.html"))
}

}

const login=async(req,res)=>{
    const {email,password}=req.body;

    const requiredUser=await User.findOne({email:email})
    if(requiredUser){
        const validPass=await bcrypt.compare(password,requiredUser.password)
        
        if(validPass){
            if(requiredUser.emailVerified)
            {
            const token=jwt.sign({email:requiredUser.email},process.env.JWT_TOKEN)
            res.status(200).send({token})
            }
            else{
                verficationMail(email)
                res.status(300).send({"msg":"Email not verified,Link sent Registered Mail Id"})
            }
            
        }
        else{
            res.status(404).send("Not a valid Credentials")
        }
    }
    else{
        res.status(404).send("Not a valid Credentials")
    }
}

const updatePassword=async(req,res)=>{
    let {emailToken,updatedPassword,token}=req.body;
    let email;
    if(token){
       
        const verified=jwt.verify(token,process.env.EMAIL_TOKEN)
        if(verified){
            console.log(verified)
            email=verified.email
        }
        else{
            res.status(404).send("updation Failed")
        }
    }
    if(emailToken){
        const verified=jwt.verify(emailToken,process.env.JWT_TOKEN)
        if(verified){
            console.log(verified)
            email=verified.email
        }
        else{
            res.status(404).send("updation Failed")
        }
    }
    const findUser=await User.findOne({email})
    if(findUser){

    //Password Encryption
    const salt= await bcrypt.genSalt(9);
    const hashedPassword= await bcrypt.hash(updatedPassword,salt)

    //User updation
    findUser.password=hashedPassword
    console.log(hashedPassword)
    const updatedUser=await User.findByIdAndUpdate(findUser._id,findUser)
    
    console.log(updatedUser)
    res.status(200).send({msg:"Password Updated"})
    }
    else{
        res.status(400).send({msg:"Password Updation Failed"})
    }
}

const forgotPassword=async(req,res)=>{
    const {email}=req.body
    const findUser=await User.findOne({email:email})
    console.log("forgotPasswordTriggeredfor ",email)
    if(findUser){
        forgotPasswordMail(email)
        res.status(200).send({msg:"vefication Email sent to register Mail Id"})
    }
    else{
        res.status(400).send({msg:"User Not found"})
    }
}

const verifyEmail=async(req,res)=>{
    const {email}=req.body.email
    const findUser=await User.findOne({email})
    if(findUser.emailVerified){
        res.status(300).send({msg:"Email Id already Verified"})
    }
    else{
        res.status(300).send({msg:"Mail Id not verified, Mail sent"})
        verificationEmail(email)
    }
}

module.exports={register,login,verifyingUserEmail,updatePassword,forgotPassword,verifyEmail}