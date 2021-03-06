const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema

// user schema / model
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64,
        },
        picture: {
            type: String,
            default: 'images/avatars/avatar.png', // set default avatar image
        },
        role: {
            type: [String], // array for multiple options
            default: ['Subscriber'],
            enum: ['Subscriber', 'Instructor', 'Admin']
        },
        stripe_account_id: '',
        stripe_seller: {},
        stripeSession: {},
        passwordResetCode: {
            data: String,
            default: '',
        },
        courses: [{type: ObjectId, ref: 'Course'}]
    },
    {timestamps: true})

export default mongoose.model('User', userSchema)
