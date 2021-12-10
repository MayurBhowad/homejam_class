const jwt = require('jsonwebtoken');

function createToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign({ id: data.id, name: data.name, email: data.email, roll: data.roll }, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(`Bearer ${token}`)
            }
        })

    })
}


module.exports = createToken;