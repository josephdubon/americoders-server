import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import Course from '../models/course'
import slugify from 'slugify'
import {readFileSync} from 'fs'

// AWS SES Config
const awsConfig = {
    accessKeyId: process.env.AWS_ACESS,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}

const S3 = new AWS.S3(awsConfig)

export const uploadImage = async (req, res) => {
    try {
        // confirm image
        const {image} = req.body

        // if no image return error
        if (!image) return res.status(400).send('No image')

        // prepare the image
        const base64Data = new Buffer
            .from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')

        // destructure image payload
        const type = image.split(';')[0].split('/')[1]

        // image params
        const params = {
            Bucket: 'americodersbucket',
            Key: `${nanoid()}.${type}`,
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${type}`,
        }

        // upload to s3
        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err)
                return res.sendStatus(400)
            }
            res.send(data)
        })
    } catch (err) {
        console.log('Image Upload Error ', err)
    }
}

export const removeImage = async (req, res) => {
    try {
        // get data from s3
        const {image} = req.body
        // image params
        const params = {
            Bucket: image.Bucket,
            Key: image.Key,
        }

        // send remove request to s3
        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log('REMOVE IMAGE S3 ', err)
                res.sendStatus(400)
            }
            res.send({ok: true})
        })
    } catch (err) {
        console.log('REMOVE IMAGE ', err)
    }
}

export const uploadVideo = async (req, res) => {
    try {
        // confirm user and instructor id's
        if (req.user._id !== req.params.instructorId) {
            return res.status(400).send('Unauthorized')
        }

        // confirm video
        const {video} = req.files

        // if no video return error
        if (!video) return res.status(400).send('No video')

        // video params
        const params = {
            Bucket: 'americodersbucket',
            Key: `${nanoid()}.${video.type.split('/')[1]}`,
            Body: readFileSync(video.path),
            ACL: 'public-read',
            ContentType: video.type,
        }

        // upload video to s3
        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err)
                return res.sendStatus(400)
            }
            res.send(data)
        })
    } catch (err) {
        console.log('Video Upload Error ', err)
    }
}

export const removeVideo = async (req, res) => {
    try {
        // get video data from s3
        const {
            Bucket,
            Key
        } = req.body

        // if nothing to destructure return error
        if (!Bucket && !Key) return res.status(400).send('No video')

        // image params
        const params = {
            Bucket, Key,
        }

        // send remove request to s3
        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log('REMOVE VIDEO S3 ', err)
                res.sendStatus(400)
            }
            res.send({ok: true})
        })
    } catch (err) {
        console.log('REMOVE VIDEO ', err)
    }
}

export const createCourse = async (req, res) => {
    try {
        // console.log('CREATE COURSE API HIT!')
        const courseExists = await Course.findOne({
            slug: slugify(req.body.name.toLowerCase()) // slug is auto generated replacing spaces with a dash '-'
        })

        // if the course exists send user error
        if (courseExists) return res.status(400).send('Title matches existing course.')

        // create course and send to db
        const course = await new Course({
            slug: slugify(req.body.name),
            instructor: req.user._id,
            ...req.body, // unpack data from form
        }).save()

        res.json(course)
    } catch (err) {
        return res.status(400).send('Course create failed. Try again.')
    }
}

export const updateCourse = async (req, res) => {
    try {
        // get course slug
        const {slug} = req.params

        // find course from slug
        const course = await Course.findOne({slug}).exec()

        // if _id and instructor do not match send an error message
        if (req.user._id != course.instructor) {
            return res.status(400).send('Unauthorized')
        }

        // find and update course
        const updated = await Course.findOneAndUpdate({slug}, req.body, {
            new: true,
        }).exec()

        // save updates
        res.json(updated)
    } catch (err) {
        return res.status(400).send('Update create failed. Try again.', err.message)
    }
}

export const readCourseData = async (req, res) => {
    try {
        const foundCourse = await Course
            .findOne({slug: req.params.slug})
            .populate(
                'instructor', '_id name'
            ).exec()

        res.json(foundCourse)
    } catch (err) {
        console.log('READ COURSE DATA ERROR ', err)
    }
}

export const addLesson = async (req, res) => {
    try {
        // console.log('hit add lesson api!')

        // get lesson data, content, and media
        const {slug, instructorId} = req.params
        const {title, content, video} = req.body

        // confirm user and instructor id's
        if (req.user._id !== instructorId) {
            return res.status(400).send('Unauthorized')
        }

        // update course
        const updated = await Course.findOneAndUpdate(
            {slug},
            // updated data
            {
                $push: {
                    lessons: {
                        title,
                        content,
                        video,
                        slug: slugify(title)
                    }
                }
            },
            {new: true}
        )
            .populate('instructor', '_id name') // populate instructor fields: _id and name
            .exec()

        // send data
        res.json(updated)

    } catch (err) {
        console.log('ADD LESSON: ', err)
        return res.status(400).send('Add lesson failed')
    }
}

export const removeLesson = async (req, res) => {
    // collect slug from url params
    const {slug, lessonId} = req.params

    // find course by slug
    const course = await Course.findOne({slug}).exec()

    // if logged in user does not match course instructor id send error
    if (req.user._id != course.instructor) {
        return res.status(400).send('Unauthorized.')
    }

    // pull lesson from course and delete from server
    const deletedLesson = await Course.findByIdAndUpdate(course._id, {
        $pull: {lessons: {_id: lessonId}} // pull lesson out of array by id
    }).exec()

    res.json({ok: true})
}

export const updateLesson = async (req, res) => {
    try {
        // collect data
        const {slug} = req.params
        const {_id, title, content, video, free_preview} = req.body
        const course = await Course.findOne({slug})
            .select('instructor')
            .exec()

        // verify instructor id
        if (course.instructor._id != req.user._id) {
            return res.status(400).send('Unauthorized')
        }

        // update lesson
        const updated = await Course.updateOne(
            {'lessons._id': _id},
            {
                $set: {
                    'lessons.$[].title': title,
                    'lessons.$[].content': content,
                    'lessons.$[].video': video,
                    'lessons.$[].free_preview': free_preview,
                },
            },
            {new: true}
        ).exec()

        console.log('updated', updated)
        res.json({ok: true})
    } catch (err) {
        console.log('updateLesson: ', err)
        return res.status(400).send('Update lesson attempt failed.')
    }
}

export const publishCourse = async (req, res) => {
    try {
        const {courseId} = req.params
        // find post
        const courseFound = await Course.findById(courseId)
            .select('instructor')
            .exec()
        // is owner?
        if (req.user._id != courseFound.instructor._id) {
            return res.status(400).send('Unauthorized')
        }

        let course = await Course.findByIdAndUpdate(
            courseId,
            {published: true},
            {new: true}
        ).exec()
        // console.log("course published", course);
        // return;
        res.json(course)
    } catch (err) {
        console.log(err)
        return res.status(400).send('Publish course failed')
    }
}

export const unpublishCourse = async (req, res) => {
    try {
        const {courseId} = req.params
        // find post
        const courseFound = await Course.findById(courseId)
            .select('instructor')
            .exec()
        // is owner?
        if (req.user._id != courseFound.instructor._id) {
            return res.status(400).send('Unauthorized')
        }

        let course = await Course.findByIdAndUpdate(
            courseId,
            {published: false},
            {new: true}
        ).exec()
        // console.log("course unpublished", course);
        // return;
        res.json(course)
    } catch (err) {
        console.log(err)
        return res.status(400).send('Unpublish course failed')
    }
}

export const courses = async (req, res) => {
    try {
        // make request to get all courses by instructor
        const allCourses = await Course.find({published: true})
            .populate('instructor', '_id name')
            .exec()

        res.json(allCourses)

    } catch (err) {
        console.log('Get courses failed.')
    }
}