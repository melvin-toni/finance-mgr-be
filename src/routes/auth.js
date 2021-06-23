const router = require('express').Router();
const controller = require('../controllers/auth');

router.post('/login', controller.checkLogin);

module.exports = router;