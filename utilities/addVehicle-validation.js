require('express-validator')
require("../utilities/index")

const inventoryModel = require("../models/inventory-model")

const utilities = require(".")
    const { body, validatonResult, validationResult } = require("express-validator")
    const validate = {}

// rules for add vehicle

validate.addVehicleRules = () => {

   return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 3})
        .withMessage("Please enter valid make"),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 3})
        .withMessage("Please enter valid model"),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 4})
        .withMessage("Please enter valid make"),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter description"),

        
        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter valid image file"),

        
        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter valid thumbnail file"),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("Please enter valid price"),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please enter valid mileage"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min:2})
        .withMessage("Please enter valid color"),

        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please select classification")

   ]

}


validate.checkVehicleData = async (req, res, next) => {
    const {classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let selection = await utilities.getSelection()
        res.render("inventory/addVehicle", {
            errors,
            title: "Add New Vehicle",
            selection,
            nav,
            classification_id,
        })
        return
    }
    next()
}

module.exports = validate