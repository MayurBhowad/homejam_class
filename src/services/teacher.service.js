const PgClient = require('../config/pg.db');
const checkPassword = require('../utils/checkPassword.utils');

const Teacher_Signup = (data) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`INSERT INTO teachers(name, email, password, subject, roll) VALUES($1, $2, $3, $4, $5) RETURNING *`, [data.name, data.email, data.password, data.subject, data.roll], (err, results) => {
            if (err) {
                reject({ status: 500, message: err.message })
            }
            resolve({ status: 200, data: results })
        })
    })
}


const Teacher_Login = (data) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`SELECT * FROM teachers WHERE email = $1`, [data.email], async (err, results) => {
            if (err) {
                reject({ status: 500, message: err.message })
            }
            let teacher = results.rows[0]
            if (teacher) {
                let passwordCheck = await checkPassword(teacher.password, data.password)
                if (passwordCheck) {
                    resolve({ status: 200, teacher: results.rows[0] })
                } else {
                    reject({ status: 403, message: 'email or password incorrect!' })
                }
            } else {
                reject({ status: 403, message: 'email or password incorrect!' })
            }
        })
    })
}

const getAllClassesByTeacher = (teacherId) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`
        SELECT e_id, student_id, class_id, name, email FROM enrolled 
        LEFT JOIN students ON enrolled.student_id = students.S_ID
        LEFT JOIN classes ON enrolled.class_id = classes.C_ID
        WHERE enrolled.teacher_id = $1;
        `, [teacherId], (err, result) => {
            if (err) {
                return reject({ status: 500, message: err.message })
            }

            //sorting data with class id
            //data is sorted in Array of students with variable classID
            let sortedData = result.rows.reduce(function (r, a) {
                r[a.class_id] = r[a.class_id] || [];
                r[a.class_id].push(a);
                return r
            }, Object.create(null))

            resolve({ status: 200, data: sortedData })
        })
    })
}


/**Feels useless */
const getEnrolledStudentsForClass = (classId) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`
        SELECT e_id, student_id, name, email FROM enrolled LEFT JOIN students ON enrolled.student_id = students.S_ID WHERE class_id = $1
        `, [classId], (err, result) => {
            if (err) {
                return reject({ message: err.message })
            }
            return resolve({ data: result.rows })
        })
    })
}



module.exports = { Teacher_Signup, Teacher_Login, getEnrolledStudentsForClass, getAllClassesByTeacher }