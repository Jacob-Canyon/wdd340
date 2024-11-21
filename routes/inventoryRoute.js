// scope of the file
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const detailController = require("../controllers/detailController")

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//
router.get("/detail/:inv_id", detailController.buildDetailById);

//Route to build inventory by classification view
router.get("/detail/:inv_id", detailController.buildDetailById);


module.exports = router