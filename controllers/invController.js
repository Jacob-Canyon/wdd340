const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/******************************
 * Build inventory by classification view
 *******************************/

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
   className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })

  }

  
invCont.buildDetailById = async function (req, res, next) {
  const inv_id = req.params.inv_id
  console.log(inv_id)
  const data = await invModel.getDetailById(inv_id)
  const grid = await utilities.buildDetailGrid(data[0])
  let nav = await utilities.getNav()
  const name = data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/detail", {
      title: name,
      nav,
      grid,
  })
} 

module.exports = invCont