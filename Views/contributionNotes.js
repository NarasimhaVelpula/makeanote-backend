const express=require('express')
const router=express.Router()
const validation=require('./TokenValidation')
const {createContributionNotes, getContributedNotes,
    getOwnedNotes,
    addContributers,
    deleteContributionNotes,
    getUsers,
    getContributers,
updateNotesByContributer,
deleteContributers,
modifyContributerAccess,
addContributionLink,
modifyLinkAccess,
updateNotesByLink,
getNotesByLink}=require('../Controllers/ContributedNotes')

// router.post('/getNotes',givingNotes);
router.post('/getOwnedNotes',validation,getOwnedNotes)
router.post('/getContributedNotes',validation,getContributedNotes)
router.post('/createContributionNotes',validation,createContributionNotes)
router.post('/addContributers',validation,addContributers);
router.post('/updateNotesByContributer',validation,updateNotesByContributer)

router.post('/getUsers',validation,getUsers)
router.post('/deleteContributers',validation,deleteContributers)
router.post('/modifyContributerAccess',validation,modifyContributerAccess)
router.post('/modifyLinkAccess',validation,modifyLinkAccess)
router.post('/getContributers',validation,getContributers)
router.post('/addContributionLink',validation,addContributionLink)
router.post('/updateNotesByLink',updateNotesByLink);
// router.post('/updateNotesTheme',updateNotesTheme);
// router.post('/updateNotesFont',updateNotesFont);
// router.post('/updatingNotesByLink',updateNotesByLink)
router.post('/getNotesByLink',getNotesByLink)
router.post('/deleteNotes',validation,deleteContributionNotes);

module.exports=router