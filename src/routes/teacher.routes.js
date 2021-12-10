const bcrypt = require('bcryptjs');
const rollAuth = require('../middleware/RollAuth.middleware')
const { Teacher_Signup, Teacher_Login, getEnrolledStudentsForClass } = require('../services/teacher.service');
const createToken = require('../utils/createToken.util');

const router = require('express').Router();


router.get('/test', (req, res) => {
    res.json({ success: true, route: '/teacher/test' })
})

router.get('/byClass', rollAuth, (req, res) => {
    const { class_id } = req.query;

    getEnrolledStudentsForClass(class_id)
        .then(students => {
            res.json({
                success: true,
                class_id: class_id,
                teacher: req.user.name,
                teacher_email: req.user.email,
                subject: req.user.subject,
                students: students.data
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ success: false, message: err.message })
        })
})

router.post('/signup', async (req, res) => {

    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newTeacher = { ...req.body, password: hashedPassword, roll: 'teacher' }

    Teacher_Signup(newTeacher)
        .then(response => {
            res.json({ success: true, data: response.data.rows })
        })
        .catch(err => {
            console.log(err);
            res.status(err.status).json({ success: false, message: err.message })
        })
})

router.post('/login', (req, res) => {
    Teacher_Login(req.body)
        .then(async (response) => {
            const token = await createToken({ id: response.teacher.t_id, name: response.teacher.name, email: response.teacher.email, roll: response.teacher.roll, subject: response.teacher.subject });
            res.json({ success: true, token: token })
        })
        .catch(err => {
            console.log(err.message);
            res.status(err.status).json({ success: false, message: err.message })
        })
})

module.exports = router;
