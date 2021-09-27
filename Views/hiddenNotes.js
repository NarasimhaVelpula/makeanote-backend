const express=require('express')
const router=express.Router()
const validation=require('./TokenValidation')
const {isHiddenPasswordSet,
    setHiddenPassword,
    getHiddenNotes,
    checkPassword,
    unhideNotes,
    deleteNotes,
    updateNoteContent,
hideNotes}=require('../Controllers/HiddenNotes')

router.post('/isHiddenPasswordSet',validation,isHiddenPasswordSet)
//router.post('/getHiddenNotes',validation,getHiddenNotes)
router.post('/setHiddenPassword',validation,setHiddenPassword)
router.post('/hideNotes',validation,hideNotes)
router.post('/getHiddenNotes',validation,getHiddenNotes)
router.post('/checkPassword',validation,checkPassword)
router.post('/unhideNotes',validation,unhideNotes)
router.post('/deleteNotes',validation,deleteNotes)
router.post('/updateNotes',validation,updateNoteContent)
module.exports=router