import express from 'express'
import { addPublication, listPublications, removePublication, updatePublication } from '../controllers/publicationController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'

const publicationRouter = express.Router()

publicationRouter.post('/add', adminAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), addPublication)
publicationRouter.get('/list', listPublications)
publicationRouter.post('/remove', adminAuth, removePublication)
publicationRouter.post('/update', adminAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updatePublication)

export default publicationRouter
