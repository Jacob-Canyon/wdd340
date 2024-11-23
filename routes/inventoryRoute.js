// scope of the file
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory by classification view
router.get("/detail/:inv_id", invController.buildDetailById);

//Route for error link
router.get("/error", errorController.buildHome)


module.exports = router