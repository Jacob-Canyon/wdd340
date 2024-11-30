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

/************build Management views********* */

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
        title: "Management",
        nav,
        errors: null,
    })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addClass", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.buildAddVehicle = async function (req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/addVehicle", {
    title: "Add New Vehicle",
    nav,
    errors: null,
  })
}

/*****************************
 * add new classification
 ****************************/
invCont.addClass = async function (req, res) {
  let nav = await utilities.getNav()
  const{classification_name} = req.body

  const addClassResults = await invModel.addClassification(classification_name)

  
  if (addClassResults) {
    req.flash(
        "notice",
        `Classification ${classification_name} Added.`
    )
    res.status(201).render("inventory/addClass", {
        title: "Add New Vehicle",
        nav,
        errors: null,
    })
} else {
    req.flash("notice", "Sorry, the classification failed to be added.")
    res.status(501).render("inventory/addClass", {
        title: "Add New Vehicle",
        nav,
        errors: null,
    })
}


}

module.exports = invCont