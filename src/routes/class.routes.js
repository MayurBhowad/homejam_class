const { CreateNewClass, getAllClasses, getClassesBySubject } = require('../services/class.service');
const rollAuth = require('../middleware/RollAuth.middleware')

const router = require('express').Router();


router.get('/test', (req, res) => {
    res.json({ success: true, route: '/class/test' })
})

router.get('/', (req, res) => {
    getAllClasses()
        .then(classes => {
            res.json({ success: true, classes: classes.data })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ success: false, message: err.message })
        })
})

router.get('/bySubject', (req, res) => {

    const { subject } = req.query;
    getClassesBySubject(subject).then(response => {
        res.json({ success: true, classes: response })
    })
        .catch(err => {
            console.log(err);
            if (err.status) {
                return res.status(err.status).json({ success: false, message: err.message })
            }
            return res.status(500).json({ success: false, message: err.message })
        })
})

router.post('/newClass', rollAuth, (req, res) => {
    // Return if user is not teacher
    // Only teacher can add class
    if (req.user.roll !== 'teacher') {
        return res.status(403).json({ success: false, message: 'Unauthorized!' })
    }

    //Create new Class
    CreateNewClass({ ...req.body, teacher_id: req.user.id, subject: req.user.subject })
        .then(response => res.json({ success: true, class: response.data }))
        .catch(err => {
            console.log(err);
            res.status(err.status).json({ success: false, message: err.message })
        })
})

module.exports = router;
