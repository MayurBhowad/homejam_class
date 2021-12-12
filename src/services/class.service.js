const PgClient = require('../config/pg.db');

const getAllClasses = () => {
    return new Promise((resolve, reject) => {
        PgClient.query(`SELECT * FROM classes`, (err, result) => {
            if (err) {
                return reject({ status: 400, message: err.message })
            }
            return resolve({ data: result.rows })
        })
    })
}

const getClassesBySubject = (subject) => {
    return new Promise((resolve, reject) => {
        PgClient.query(`SELECT * FROM classes WHERE subject = $1`, [subject], (err, result) => {
            if (err) {
                return reject({ status: 400, message: err.message })
            }
            if (result.rows.length > 0) {
                return resolve({ data: result.rows })
            } else {
                return reject({ status: 404, message: 'Class not found!' })
            }
        })
    })
}

const CreateNewClass = data => {
    return new Promise((resolve, reject) => {
        PgClient.query(`INSERT INTO classes(subject, startAt, endAt, teacher_id) VALUES($1, $2, $3, $4) RETURNING *`, [data.subject, data.startAt, data.endAt, data.teacher_id], (err, result) => {
            if (err) {
                return reject({ status: 400, message: err.message })
            }
            return resolve({ status: 200, data: result.rows[0] })
        })
    })
}

const EditClass = data => {
    return new Promise((resolve, reject) => {
        PgClient.query(`
        UPDATE classes
        SET startAt = $2, endAt = $3
        WHERE c_id = $1 RETURNING *
        `, [data.class_id, data.startAt, data.endAt], (err, result) => {
            if (err) {
                return reject({ status: 400, message: err.message })
            }
            return resolve({ status: 200, data: result.rows[0] })
        })
    })
}


module.exports = { CreateNewClass, getAllClasses, getClassesBySubject, EditClass }