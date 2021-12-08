// Controller
const userController = require('../controllers/user');

const express = require('express');
const router = express.Router();
    
router.get('/', userController.onGetAllUsers)
    .post('/', userController.onCreateUser)
    .get("/:id", userController.onGetUserById)
    .put('/:id', userController.onUpdateUserById)
    .delete('/:id', )

module.exports = router