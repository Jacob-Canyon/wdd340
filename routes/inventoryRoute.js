// scope of the file
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory by classification view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailById));

//Route for error link
router.get("/error", utilities.handleErrors(errorController.buildHome))


module.exports = router