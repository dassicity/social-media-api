const express = require('express');
const { body } = require('express-validator')

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid e-mail id')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('An user with this e-mail already exists!')
                    }
                })
        }),
    body('password').isLength({ min: 6 }),
    body('name').trim().not().isEmpty()
], authController.signUp);

router.post('/signin', authController.signIn);

module.exports = router;