const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//default
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
//Login
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//logout get rid of cookie
router.get("/logout", utilities.handleErrors(accountController.Logout))
//register route
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//Process the registration data
router.post('/register',
    regValidate.registionRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
    )
//Process the login attempt
router.post(
    "/login",
    regValidate.passwordRules(),
    utilities.handleErrors(accountController.accountLogin)
)

router.get('/accountManagement',
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)
//accountUpdate 

router.get('/accountUpdate',
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdate)
)

router.post("/accountUpdate",
    regValidate.accountUpdateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.upDateAccount)
)

router.post("/passwordUpdate", 
    regValidate.passwordUpdateRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.passwordUpdate)
 )

module.exports = router