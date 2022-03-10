const {User} = require('../models/user')
const {comparePassword, hashPassword} = require('../utils/auth')
const jwt = require('jsonwebtoken')

export const register = async (req, res) => {
    try {
        // collect data/values
        const {name, email, password} = req.body

        // validation
        if (!name) return res.status(400).send('Name is required.')
        if (!password || password.length < 6) {
            return res
                .status(400)
                .send('Password is required and minimum length of 6 characters is recommended.')
        }

        // check if email is already registered in system
        let userExists = await User.findOne({email}).exec()
        if (userExists) return res.status(400).send('Email already exists in system.')

        // hash the password
        const hashedPassword = await hashPassword(password)

        // register user to db
        const user = new User({
            name, email, password: hashedPassword,
        })

        // save user to db
        await user.save()

        // verify save success with message
        return res.json({ok: true})

    } catch (err) {
        console.log(err)
        {
            return res.status(400).send('There was an error with your request. Please try again.')
        }
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        // find user
        const user = await User.findOne({email}).exec()

        if (!user) return res.status(400).send('No user found with that email.')

        // compare passwords
        const match = await comparePassword(password, user.password)

        // create signed jwt
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d', // expire cookie in 7 days time
        })

        // return user and token to client, exclude hashed password
        user.password = undefined

        // send token in cookie
        res.cookie('token', token, {
            httpOnly: true, // secure: true, // only works on https
        })

        // send user as a json response
        res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(400)
    }
}