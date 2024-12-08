require("express-validator")
require("../utilities/index")
const accountModel = require("../models/account-model")

const utilities = require(".")
    const { body, validatonResult, validationResult } = require("express-validator")
    const validate = {}

/***********************************
 * Registration Data Validtion Rules
 ***********************************/

validate.registionRules  = () => {
    return [
        //firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a first name."),//message for error

        //lastname rules
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a last name."),
        
        //valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()// refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async(account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        //password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,

            })
            .withMessage("Password does not meet requirements."),
    ]
}

/***********************************************************
 * Check data and return errors or continue to registration
 ***********************************************************/
validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*********************************
 * login validation
 ********************************/


validate.passwordRules  = () => {
    return [
    
        //valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()// refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async(account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        //password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,

            })
            .withMessage("Password does not meet requirements."),
    ]
}

/****************************
 * validate the update account
 */


validate.accountUpdateRules  = () => {
    return [
        //firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a first name."),//message for error

        //lastname rules
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a last name."),
        
        //valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()// refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async(account_email, {req}) => {
                const seachedEmail = await accountModel.getAccountByEmail(account_email)
                const currentId = parseInt(req.body.account_id)

                if (seachedEmail.account_id != currentId) {
                    throw new Error("Email exists. Use different email")
                }
            }),

        body("account_id")
            
    ]
}

/******************************
 * password rules for
 */


validate.passwordUpdateRules  = () => {
    return [
        

        //password meets requirements
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,

            })
            .withMessage("Password does not meet requirements."),
    ]
}


/***********************************************************
 * Check password before update
 ***********************************************************/
validate.checkPasswordData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/accountUpdate", {
            errors,
            title: "Account Update",
            nav,
        })
        return
    }
    next()
}

/***********************************************************
 * Checks account data before updating
 ***********************************************************/
validate.checkUpdateData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/accountUpdate", {
            errors,
            title: "Account Update",
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
        return
    }
    next()
}



module.exports = validate