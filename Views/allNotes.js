const express=require('express')

const router=express.Router()
const validation=require('./TokenValidation')
const {getAllNotes,createNotes,updateNoteContent,deleteNotes}=require('../Controllers/Notes')

router.post('/allNotes',validation,getAllNotes)
router.post('/createNotes',validation,createNotes)
router.post('/updateNotesContent',validation,updateNoteContent)
router.post('/deleteNotes',validation,deleteNotes)

module.exports=router