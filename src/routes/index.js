const router = require('express').Router();

router.use('/teacher', require('./teacher.routes'));
router.use('/student', require('./student.routes'));
router.use('/class', require('./class.routes'));

module.exports = router;