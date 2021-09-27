const jwt=require('jsonwebtoken')

module.exports=function(req,res,next){
    const token=req.body.authToken
    if(token){
        const verified=jwt.verify(token,process.env.JWT_TOKEN)
        if(verified){
            console.log(verified)
            req.email=verified.email
            next();
        }
        else{
            res.status(401).send("invalid token")
        }
    }
    else{
        console.log("validation Failed")
        res.status(401).send('access denied')
    }
}