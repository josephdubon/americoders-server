import User from '../models/user'
import queryString from 'query-string'

const stripe = require('stripe')(process.env.STRIPE_SECRET)

export const makeInstructor = async (req, res) => {
    try {
        // find user from db
        const user = await User.findById(req.user._id).exec()

        // if user doesn't have a stripe_account_id yet, create one
        if (!user.stripe_account_id) {
            const account = await stripe.accounts.create({type: 'express'})
            // console.log('ACCOUNT => ', account.id)
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
        // console.log(accountLink)

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