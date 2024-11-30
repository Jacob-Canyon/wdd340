// scope of the file
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/addClass-validation")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory by classification view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailById));

//Route for error link
router.get("/error", utilities.handleErrors(errorController.buildHome))

//Route for management
router.get("/management", utilities.handleErrors(invController.buildManagement))

router.get("/", utilities.handleErrors(invController.buildManagement))

//Add classification 
router.get("/addClass",utilities.handleErrors(invController.buildAddClassification))
router.post("/addClass",
    classValidate.addClassRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClass))

//Add vehicle
router.get("/addVehicle", utilities.handleErrors(invController.buildAddVehicle))


module.exports = router