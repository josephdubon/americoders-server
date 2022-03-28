import expressJwt from 'express-jwt'
import User from '../models/user'


// confirm user is signedIn in to continue request
export const requireSignIn = expressJwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
})