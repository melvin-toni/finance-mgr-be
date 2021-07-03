const router = require('express').Router();
const controller = require('../controllers/user');

router.get('/finance-account', controller.readAllFinAcc);

router.post('/register', controller.register);
router.post('/finance-account', controller.createFinAcc);

module.exports = router;