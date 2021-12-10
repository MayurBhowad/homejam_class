const bcrypt = require('bcryptjs');
const { response } = require('express');
const rollAuth = require('../middleware/RollAuth.middleware')
const { Student_Signup, Student_Login, EnrollingToClass } = require('../services/student.service');
const createToken = require('../utils/createToken.util');

const router = require('express').Router();


router.get('/test', (req, res) => {
    res.json({ success: true, route: '/student/test' })
})

router.post('/signup', async (req, res) => {

    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newStudent = { ...req.body, password: hashedPassword, roll: 'student' }

    Student_Signup(newStudent)
        .then(response => {
            res.json({ success: true, data: response.data.rows })
        })
        .catch(err => {
            console.log(err);
            res.status(err.status).json({ success: false, message: err.message })
        })
})

router.post('/login', (req, res) => {
    Student_Login(req.body)
        .then(async (response) => {
            const token = await createToken({ id: response.student.s_id, name: response.student.name, email: response.student.email, roll: response.student.roll });
            res.json({ success: true, token: token })
        })
        .catch(err => {
            console.log(err.message);
            res.status(err.status).json({ success: false, message: err.message })
        })
})

router.post('/enroll', rollAuth, (req, res) => {
    if (req.user.roll !== 'student') {
        return res.status(401).json({ success: false, message: 'Only student can enroll!' })
    }

    EnrollingToClass({ ...req.body, student_id: req.user.id })
        .then(response => {
            res.json({ success: true, data: response.data })
        })
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ success: false, message: err.message })
            } else {
                res.status(500).json({ success: false, message: err.message })
            }
        })
})

module.exports = router;
