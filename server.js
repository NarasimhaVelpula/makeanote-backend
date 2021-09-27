const express=require('express')
const app=express();
const cors=require('cors')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const authRouter=require('./Views/auth')
const noteRouter=require('./Views/allNotes')
const contributionRouter=require('./Views/contributionNotes')
const hiddenRouter=require('./Views/hiddenNotes')
dotenv.config();
app.use(cors());
app.use(express.json())
app.use('/auth',authRouter)
app.use('/notes',noteRouter)
app.use('/contribution',contributionRouter)
app.use('/hidden',hiddenRouter)

const dbUrl=process.env.DB_CONNECTION_STRING;
const PORT= process.env.PORT;

mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{app.listen(PORT,()=>{console.log("server running on port "+PORT)})})
    .catch((error)=>{console.log(error)});
