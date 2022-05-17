import express from 'express'
import formidable from 'express-formidable'

// middleware
import {isEnrolled, isInstructor, requireSignIn} from '../middlewares'

// controllers
import {
    addLesson,
    checkEnrollment,
    courses,
    createCourse,
    freeEnrollment,
    listComplete,
    markIncomplete,
    markComplete,
    paidEnrollment,
    publishCourse,
    readCourseData,
    removeImage,
    removeLesson,
    removeVideo,
    stripeSuccess,
    unpublishCourse,
    updateCourse,
    updateLesson,
    uploadImage,
    uploadVideo,
    userCourses,
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
router.post('/paid-enrollment/:courseId', requireSignIn, paidEnrollment)
router.get('/stripe-success/:courseId', requireSignIn, stripeSuccess)

// user courses
router.get('/user-courses', requireSignIn, userCourses)
router.get('/user/course/:slug', requireSignIn, isEnrolled, readCourseData)

// mark completed
router.post('/mark-complete', requireSignIn, markComplete)
router.post('/list-complete', requireSignIn, listComplete)
router.post('/mark-incomplete', requireSignIn, markIncomplete)

module.exports = router