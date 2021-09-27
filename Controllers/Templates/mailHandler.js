const mailer=require('nodemailer')
var handlebars = require('handlebars');
var fs = require('fs');
const jwt=require('jsonwebtoken')

const transporter=mailer.createTransport({
    service:'gmail',
    auth:{
        user:'tophiretalentacquisation@gmail.com',
        pass:'Nani@1234'
    }
});

const verficationMail=async email=>{
    
    var html = fs.readFileSync(__dirname+'/verificationTemplate.html')
    const token=jwt.sign({email:email},process.env.EMAIL_TOKEN,{ expiresIn: '1h' })
    const template=handlebars.compile(html.toString())
    var replacements = {
        token: token
   };    
   var htmlToSend=template(replacements)
    const mailOptions={
        from: '"Make A Note👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Make A Note Verification ✔", // Subject line
        html: htmlToSend, // html body
    }
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log("------Error in mail sending------")
            console.log(error)
        }
        else{
            console.log("Verifcation Mail sent to --"+email)
        }
    })

}

const forgotPasswordMail=email=>{
    var html = fs.readFileSync(__dirname+'/forgotPasswordTemplate.html')
    const token=jwt.sign({email:email},process.env.EMAIL_TOKEN,{ expiresIn: '1h' })
    const template=handlebars.compile(html.toString())
    var replacements = {
        host:"https://makeanote.vercel.app",
        token: token
   };  
   var htmlToSend=template(replacements)  
    const mailOptions={
        from: '"Make A Note👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject:"Make A Note Password Updation",
        html: htmlToSend
    }
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log("------Error in mail sending------")
            console.log(error)
        }
        else{
            console.log("Verifcation Mail sent to --"+email)
        }
    })

}

module.exports={verficationMail,forgotPasswordMail}