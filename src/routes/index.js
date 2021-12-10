const router = require('express').Router();

router.use('/teacher', require('./teacher.routes'));
router.use('/student', require('./student.routes'));

module.exports = router;