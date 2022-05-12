import express from 'express'
import formidable from 'express-formidable'

// middleware
import {isInstructor, requireSignIn} from '../middlewares'

// controllers
import {
    addLesson,
    checkEnrollment,
    courses,
    createCourse,
    freeEnrollment,
    publishCourse,
    readCourseData,
    removeImage,
    removeLesson,
    removeVideo,
    unpublishCourse,
    updateCourse,
    updateLesson,
    uploadImage,
    uploadVideo
} from '../controllers/course'

// add router
const router = express.Router()

// courses listing routes
router.get('/courses', courses)

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

// publish unpublish
router.put('/course/publish/:courseId', requireSignIn, publishCourse)
router.put('/course/unpublish/:courseId', requireSignIn, unpublishCourse)

// lesson routes
router.post('/course/lesson/:slug/:instructorId', requireSignIn, addLesson) // must be a logged-in instructor for request
router.put('/course/lesson/:slug/:instructorId', requireSignIn, updateLesson) // must be a logged-in instructor for request
router.put('/course/:slug/:lessonId', requireSignIn, removeLesson)

// enrollment routes
router.get('/check-enrollment/:courseId', requireSignIn, checkEnrollment)

router.post('/free-enrollment/:courseId', requireSignIn, freeEnrollment)

module.exports = router