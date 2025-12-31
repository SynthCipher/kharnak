import express from 'express'
import { addStory, listStories, removeStory, getSingleStory, updateStory, likeStory } from '../controllers/storyController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'

const storyRouter = express.Router()

storyRouter.post('/add', adminAuth, upload.single('image'), addStory)
storyRouter.get('/list', listStories)
storyRouter.post('/remove', adminAuth, removeStory)
storyRouter.post('/like', likeStory)
storyRouter.get('/:id', getSingleStory)
storyRouter.put('/:id', adminAuth, upload.single('image'), updateStory)

export default storyRouter
