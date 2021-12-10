const PgClient = require('../config/pg.db');
const checkPassword = require('../utils/checkPassword.utils');

const Student_Signup = (data) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`INSERT INTO students(name, email, password) VALUES($1, $2, $3) RETURNING *`, [data.name, data.email, data.password], (err, results) => {
            if (err) {
                reject({ status: 500, message: err.message })
            }
            resolve({ status: 200, data: results })
        })
    })
}


const Student_Login = (data) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`SELECT * FROM students WHERE email = $1`, [data.email], async (err, results) => {
            if (err) {
                reject({ status: 500, message: err.message })
            }
            let student = results.rows[0]
            if (student) {
                let passwordCheck = await checkPassword(student.password, data.password)
                if (passwordCheck) {
                    resolve({ status: 200, student: results.rows[0] })
                } else {
                    reject({ status: 403, message: 'email or password incorrect!' })
                }
            } else {
                reject({ status: 403, message: 'email or password incorrect!' })
            }
        })
    })
}


module.exports = { Student_Signup, Student_Login }