import User from '../models/user'
import {comparePassword, hashPassword} from '../utils/auth'
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'


// AWS SES Config
const awsConfig = {
    accessKeyId: process.env.AWS_ACESS,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}

const SES = new AWS.SES(awsConfig)

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
        return res.status(400).send('Error. Try again.')
    }
}

export const logout = async (req, res) => {
    try {
        // clear cookie
        res.clearCookie('token')
        return res.json({
            message: 'Successfully logged out.'
        })
    } catch (err) {
        console.log('ERROR', err)
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').exec()
        return res.json({ok: true}) // set user route to true
    } catch (err) {
        console.log(err)
    }
}

export const sendTestEmail = async (req, res) => {
    // console.log('send email using SES')
    // return res.json({ok: true})
    const params = {
        Source: process.env.EMAIL_SEND,
        Destination: {
            ToAddresses: [process.env.EMAIL_RECIEVE], // this must be an array
        },
        ReplyToAddresses: [process.env.EMAIL_REPLY], // this must be an array
        // email template config for email password reset
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                    <html lang='en'>
                        <h1>Americoders</h1>
                        <h2>Reset Password</h2>
                        <p>Hello friend,<br><br>
                        Please use the following link to reset your password.</p>
                    </html>
                    `,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'RE: Password reset link',
            },
        },
    }

    const emailSent = SES.sendEmail(params).promise()

    emailSent
        .then((data) => {
            console.log(data)
            res.json({ok: true})
        })
        .catch((err) => {
            console.log(err)
        })

}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        // console.log(email);
        const shortCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate(
            {email},
            {passwordResetCode: shortCode}
        );
        if (!user) return res.status(400).send("User not found");

        // prepare for email
        const params = {
            Source: process.env.EMAIL_SEND,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>Use this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i><a href='https://americoders.org'>americoders.org</a></i>
                </html>
              `,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password",
                },
            },
        };

        const emailSent = SES.sendEmail(params).promise();
        emailSent
            .then((data) => {
                console.log(data);
                res.json({ok: true});
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        console.log(err);
    }
};

export const resetPassword = async (req, res) => {
    try {
        console.log('reset password yo!')
    } catch (err) {
        console.log(err)
    }
}