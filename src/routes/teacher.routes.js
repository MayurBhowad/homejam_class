const bcrypt = require('bcryptjs');
const rollAuth = require('../middleware/RollAuth.middleware')
const { Teacher_Signup, Teacher_Login, getEnrolledStudentsForClass, getAllClassesByTeacher } = require('../services/teacher.service');
const createToken = require('../utils/createToken.util');

const router = require('express').Router();


router.get('/test', (req, res) => {
    res.json({ success: true, route: '/teacher/test' })
})


/**Feels useles */
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

router.get('/teacher_classes', rollAuth, (req, res) => {
    if (req.user.roll !== 'teacher') {
        return res.status(403).json({ success: false, message: 'you are not authorized to view resource!' })
    }

    getAllClassesByTeacher(req.user.id)
        .then(classes => {
            res.json({
                success: true,
                teacher: req.user.name,
                teacher_email: req.user.email,
                subject: req.user.subject,
                classes: classes.data
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
            res.json({ success: true, data: response.data })
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
