const {User} = require('../models/user')

const {hashPassword} = require('../utils/auth')

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