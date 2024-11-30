require('express-validator')
require("../utilities/index")

const inventoryModel = require("../models/inventory-model")

const utilities = require(".")
     const {body, validationResult} = require("express-validator")
     const validate = {}

validate.addClassRules = () => {
    return [
        body("classifiction_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 2})
        .withMessage("Please provide a valid classification.")//message for error
        .custom(async(classification_name) => {
            const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
            if (classificationExists) {
                throw new Error("Classification exists.")
            }
        }),
    ]
}

//Check Classification
validate.checkClassData = async (req, res, next) => {
    const {classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addClass", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate