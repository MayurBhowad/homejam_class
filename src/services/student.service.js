const PgClient = require('../config/pg.db');
const checkPassword = require('../utils/checkPassword.utils');

const Student_Signup = (data) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`INSERT INTO students(name, email, password, roll) VALUES($1, $2, $3, $4) RETURNING *`, [data.name, data.email, data.password, data.roll], (err, results) => {
            if (err) {
                reject({ status: 400, message: err.message })
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

const EnrollingToClass = data => {
    return new Promise((resolve, reject) => {
        // PgClient.query(`INSERT INTO enrolled(teacher_id, student_id, class_id) VALUES($1, $2, $3) RETURNING *`, [data.teacher_id, data.student_id, data.class_id], (err, result) => {
        PgClient.query(`
            INSERT INTO enrolled(teacher_id, student_id, class_id) VALUES((SELECT teacher_id FROM CLASSES WHERE c_id = $2), $1, $2) RETURNING *
            `, [data.student_id, data.class_id], (err, result) => {
            if (err) {
                return reject({ status: 400, message: err.message })
            }
            return resolve({ status: 200, data: result.rows })
        })
    })
}

const getAllClassesByStudents = (studentId) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`
        SELECT e_id, enrolled.teacher_id, teachers.name, teachers.email,class_id, classes.subject FROM enrolled 
        LEFT JOIN teachers ON enrolled.teacher_id = teachers.T_ID
        LEFT JOIN classes ON enrolled.class_id = classes.C_ID
        WHERE enrolled.student_id = $1;;
        `, [studentId], (err, result) => {
            if (err) {
                return reject({ status: 400, message: err.message })
            }

            //sorting data with class id
            //data is sorted in Array of students with variable classID
            let sortedData = result.rows.reduce(function (r, a) {
                r[a.subject] = r[a.subject] || [];
                r[a.subject].push(a);
                return r
            }, Object.create(null))

            resolve({ status: 200, data: sortedData })
        })
    })
}

const getEnrolledClasses = studentId => {
    return new Promise((resolve, reject) => {
        PgClient.query(`SELECT * FROM enrolled WHERE student_id=$1`, [studentId], (err, result) => {
            if (err) {
                return reject({ status: 400, message: err.message })
            }
            if (result.rows.length > 0) {
                return resolve({ status: 200, data: result.rows })
            } else {
                return reject({ status: 404, message: 'You are not enrolled for class!' })
            }
        })
    })
}


module.exports = { Student_Signup, Student_Login, EnrollingToClass, getEnrolledClasses, getAllClassesByStudents }