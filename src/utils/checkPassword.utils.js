const bcrypt = require('bcryptjs');

function checkPassword(db_password, typed_password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(typed_password, db_password, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


module.exports = checkPassword;