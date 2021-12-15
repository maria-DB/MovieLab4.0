const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserInfo,
    registerUser,
    loginUser,
    logoutUser,
    googleRegister
} = require('../controllers/userController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/users').get(isAuthenticatedUser,getAllUsers);
router.route('/users/:id').get(isAuthenticatedUser,getUserInfo);
router.route('/users').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/google/register').post(googleRegister)

module.exports = router;