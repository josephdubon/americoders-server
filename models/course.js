import mongoose from 'mongoose'

const {ObjectId} = mongoose.Schema

// lesson schema, multiple lessons can be set to one course
const lessonSchema = new mongoose.Schema({
        title: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 320,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        content: {
            type: {},
            minlength: 200,
        },
        html: {
            type: {},
            minlength: 25,
        },
        css: {
            type: {},
            minlength: 25,
        },
        javascript: {
            type: {},
            minlength: 25,
        },
        video: {},
        free_preview: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true} // automatically manage createdAt and updatedAt properties on your documents
)


// course schema, parent to lessonSchema
const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 320,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: {},
            minlength: 200,
            required: true
        },
        price: {
            type: Number,
            default: 49.99,
        },
        image: {},
        category: String,
        published: {
            type: Boolean,
            default: false,
        },
        paid: {
            type: Boolean,
            default: true,
        },
        instructor: { // make relationship instructor -> lessons
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        lessons: [lessonSchema] // each lesson in array must meet requirements set from lesson schema
    },
    {timestamps: true} // automatically manage createdAt and updatedAt properties on your documents
)

// create the schema into a model
export default mongoose.model('Course', courseSchema)