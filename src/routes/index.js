const router = require('express').Router();

router.use('/teacher', require('./teacher.routes'));

module.exports = router;