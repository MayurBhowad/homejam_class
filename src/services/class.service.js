const PgClient = require('../config/pg.db');

const CreateNewClass = data => {
    return new Promise((resolve, reject) => {
        PgClient.query(`INSERT INTO classes(subject, startAt, endAt) VALUES($1, $2, $3) RETURNING *`, [data.subject, data.startAt, data.endAt], (err, result) => {
            if (err) {
                return reject({ status: 500, message: err.message })
            }
            return resolve({ status: 200, data: result.rows[0] })
        })
    })
}


module.exports = { CreateNewClass }