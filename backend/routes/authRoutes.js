const express = require('express')

const router = express.Router()

const userSignUpController = require("../controllers/User/authSignup")
const userSignInController = require('../controllers/User/authSignin')
const userDetailsController = require('../controllers/User/userDetails')
const authToken = require('../middleware/authMiddleware')
const userLogout = require('../controllers/User/authLogout')
const allUsers = require('../controllers/User/allUsers')
const refreshTokenController = require('../controllers/User/refreshToken')
const googleSigninController = require('../controllers/User/googleSignin')

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.post("/google-signin", googleSigninController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)
router.post("/refresh-token", refreshTokenController)

//admin panel 
router.get("/all-user",authToken,allUsers)

module.exports = router;
