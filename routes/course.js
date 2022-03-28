const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {removeImage, uploadImage} from '../controllers/courses'

// routes
router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

module.exports = router