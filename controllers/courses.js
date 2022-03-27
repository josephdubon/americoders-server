import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'

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