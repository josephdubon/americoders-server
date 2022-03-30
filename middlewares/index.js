import expressJwt from 'express-jwt'
import User from '../models/user'


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