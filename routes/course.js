import express from 'express'
import formidable from 'express-formidable'

// middleware
import {isInstructor, requireSignIn} from '../middlewares'

// controllers
import {
    addLesson,
    createCourse,
    readCourseData,
    removeImage,
    removeVideo,
    updateCourse,
    uploadImage,
    uploadVideo
} from '../controllers/course'

// add router
const router = express.Router()

// image routes
router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

// video routes
router.post('/course/upload-video/:instructorId', requireSignIn, formidable(), uploadVideo)
router.post('/course/remove-video/:instructorId', requireSignIn, removeVideo)

// course routes
router.get('/course/:slug', readCourseData)

router.put('/course/:slug', requireSignIn, updateCourse) // must be a logged-in instructor for request

router.post('/course', requireSignIn, isInstructor, createCourse) // must be a logged-in instructor for request
router.post('/course/lesson/:slug/:instructorId', requireSignIn, addLesson)

module.exports = router