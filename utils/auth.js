import bcrypt from 'bcrypt'

// will take user password and hash it for security
export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        // 12 is mid-level
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

// compare user password with hash password
export const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}