const userController = require('../controller/userController');
const router = require('express').Router();


router
    .get('/',userController.index)
    .get('/create', userController.create)
    .get('/delete/:id', userController.delete)
    .post('/', userController.store)
    .get('/login', userController.login)
    .post('/login', userController.attemptLogin)

module.exports = router;
