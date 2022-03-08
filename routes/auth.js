const express = require('express')
const router = express.Router()

// controllers
import {register} from '../controllers/auth'

// register
router.get('/register', register)

module.exports = router