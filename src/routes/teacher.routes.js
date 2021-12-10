const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const req = require('express/lib/request');
const { Teacher_Signup, Teacher_Login } = require('../services/teacher.service');
const createToken = require('../utils/createToken.util');

const router = require('express').Router();


router.get('/test', (req, res) => {
    res.json({ success: true, route: '/teacher/test' })
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
