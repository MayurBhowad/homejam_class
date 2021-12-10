const { CreateNewClass } = require('../services/class.service');
const rollAuth = require('../middleware/RollAuth.middleware')

const router = require('express').Router();


router.get('/test', (req, res) => {
    res.json({ success: true, route: '/class/test' })
})

router.post('/newClass', rollAuth, (req, res) => {
    // Return if user is not teacher
    // Only teacher can add class
    if (req.user.roll !== 'teacher') {
        return res.status(403).json({ success: false, message: 'Unauthorized!' })
    }

    //Create new Class
    CreateNewClass(req.body)
        .then(response => res.json({ success: true, class: response.data }))
        .catch(err => {
            console.log(err);
            res.status(err.status).json({ success: false, message: err.message })
        })
})

module.exports = router;
