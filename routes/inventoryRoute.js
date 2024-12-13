// scope of the file
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/addClass-validation")
const vehicleValidate = require("../utilities/addVehicle-validation")
const { addVehicle } = require("../models/inventory-model")
const validate = require("../utilities/addVehicle-validation")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory by classification view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailById));
router.post("/detail/:inv_id", validate.checkFavorites(), utilities.handleErrors(invController.addFavorite));

//Route for error link
router.get("/error", utilities.handleErrors(errorController.buildHome))

//Route for management
router.get("/management",utilities.checkAccess, utilities.handleErrors(invController.buildManagement))
router.get("/", utilities.handleErrors(invController.buildManagement))

//Route for edit
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditView))

//Route for selection in management
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Add classification 
router.get("/addClass",utilities.checkAccess, utilities.handleErrors(invController.buildAddClassification))
router.post("/addClass",
    classValidate.addClassRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClass))

//Add vehicle
router.get("/addVehicle",utilities.checkAccess, utilities.handleErrors(invController.buildAddVehicle))
router.post("/addVehicle",
    vehicleValidate.addVehicleRules(),
    vehicleValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle))

//update inventory
router.post("/update/",

    vehicleValidate.updateRules(),
    vehicleValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

//delete inventory
router.get("/delete/:inv_id",
    utilities.checkAccess,
    utilities.handleErrors(invController.deleteView)
)
router.post("/delete", 
    utilities.handleErrors(invController.deleteInv)
)

//favorite inventory
router.get("/favorite", utilities.handleErrors(invController.buildFavorite))
router.get("/favDetail/:inv_id", utilities.handleErrors(invController.buildDetailFavorite))
router.post("/favDetail/:inv_id", validate.checkFavorites(), utilities.handleErrors(invController.removeFavorite))



module.exports = router