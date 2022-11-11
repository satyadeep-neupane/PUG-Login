const userController = require('../controller/userController');
const router = require('express').Router();


router
    .get('/',userController.index)
    .get('/create', userController.create)
    .post('/', userController.store)
    .get('/login', userController.login)
    .post('/login', userController.verifyUser)

module.exports = router;
