import User from '../models/user'
import Course from '../models/course'
import queryString from 'query-string'

const stripe = require('stripe')(process.env.STRIPE_SECRET)

export const makeInstructor = async (req, res) => {
    try {
        // find user from db
        const user = await User.findById(req.user._id).exec()

        // if user doesn't have a stripe_account_id yet, create one
        if (!user.stripe_account_id) {
            const account = await stripe.accounts.create({type: 'express'})
            user.stripe_account_id = account.id
            user.save()
        }

        // create account link based on account id (for frontend to complete on-boarding)
        let accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type: 'account_onboarding',
        })

        // (optional) pre-fill any info such as email (optional), then send url response to frontend
        accountLink = Object.assign(accountLink, {
            'stripe_user[email': user.email,
        })

        // then send the account link as response to frontend
        res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
    } catch (err) {
        console.log('MAKE INSTRUCTOR ERR ', err)
    }
}

export const getAccountStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).exec()
        const account = await stripe.accounts.retrieve(user.stripe_account_id)

        // check if account has charges enabled
        if (!account.charges_enabled) {
            return res.status(401).send('Unauthorized')
        } else {
            const statusUpdated = await User.findByIdAndUpdate(user._id, {
                    stripe_seller: account,
                    $addToSet: {role: 'Instructor'}, // add 'Instructor' role, check for duplicates with addToSet
                },
                {new: true}
            ).select('-password').exec()

            // send new user data to db
            res.json(statusUpdated)
        }
    } catch (err) {
        console.log('GET STATUS ERR ', err)
    }
}

export const currentInstructor = async (req, res) => {
    try {
        // find user
        let user = await User.findById(req.user._id).select('-password').exec()

        // verify user 'Instructor' role
        if (!user.role.includes('Instructor')) {
            return res.sendStatus(403)
        } else {
            res.json({ok: true})
        }
    } catch (err) {
        console.log('CURRENT INSTRUCTOR ERROR ', err)
    }
}

export const instructorCourses = async (req, res) => {
    try {
        const courses = await Course
            .find({instructor: req.user._id}) // find courses by use id
            .sort({createdAt: -1}) // sort by created dateAt date from newest to oldest
            .exec()

        console.log('instructor courses api hit!')
        res.json(courses)
    } catch (err) {
        console.log('CURRENT INSTRUCTOR COURSES ERROR ', err)
    }
}

export const studentCount = async (req, res) => {
    try {
        // find all user from given course
        const users = await User.find({courses: req.body.courseId})
            .select('_id')
            .exec()

        res.json(users)

    } catch (err) {
        console.log(err)
    }
}

export const instructorBalance = async (req, res) => {
    try {
        // find user
        let user = await User.findById(req.user._id).exec()

        // get balance from Stripe
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id,
        })

        res.json(balance)
    } catch (err) {
        console.log(err)
    }
}