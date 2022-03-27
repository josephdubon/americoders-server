import {register} from "../controllers/auth";

const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {uploadImage} from '../controllers/courses'

// routes
router.post('/course/upload-image', uploadImage)

module.exports = router