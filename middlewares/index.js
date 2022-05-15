import expressJwt from 'express-jwt'
import User from '../models/user'
import Course from '../models/course'


// confirm user is signedIn in to continue request
export const requireSignIn = expressJwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
})

// confirm user is an instructor to continue request
export const isInstructor = async (req, res, next) => {
    try {
        // get user
        const user = await User.findById(req.user._id).exec()
        // if no user found, give unauthorized error, if found run next()
        if (!user.role.includes('Instructor')) {
            return res.sendStatus(403)
        } else {
            next()
        }
    } catch (err) {
        console.log('IS INSTRUCTOR ', err)
    }
}

// confirm user is enrolled to view user course
export const isEnrolled = async (req, res, next) => {
    try {
        // get user
        const user = await User.findById(req.user._id).exec()

        // get user courses
        const course = await Course.findOne({slug: req.params.slug}).exec()

        // check if course_id is found in user courses array
        let ids = []
        for (let i = 0; i < user.courses.length; i++) {
            ids.push(user.courses[i].toString())
        }

        if (!ids.includes((course._id.toString()))) {
            res.sendStatus(403)
        } else {
            next()
        }

    } catch (err) {
        console.log('MIDDLEWARE IS_ENROLLED ERR: ', err)
    }
}

