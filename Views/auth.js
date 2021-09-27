const express=require('express')
const { forgotPassword,updatePassword,verifyingUserEmail,login,register,verifyEmail } = require('../Controllers/Auth')
const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/verify',verifyEmail)
router.get('/verifyByEmail/:user',verifyingUserEmail)
router.post('/updatePassword',updatePassword)
router.post('/forgotPassword',forgotPassword)

module.exports=router