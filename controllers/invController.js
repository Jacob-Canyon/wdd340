const { body } = require("express-validator")
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
  const selection = await utilities.getSelection()


  res.render("./inventory/management", {
        title: "Management",
        nav,
        selection,
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
  let selection = await utilities.getSelection()
  res.render("./inventory/addVehicle", {
    title: "Add New Vehicle",
    nav,
    selection,
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

/*****************************
 * Process new vehicle
 ***************************/

invCont.addNewVehicle = async function(req, res) {
 
  let selection = await utilities.getSelection()
  let nav = await utilities.getNav()

  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
  console.log(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id )

  const addVehicleResult = await invModel.addVehicle(
    classification_id,
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
  )

  if(addVehicleResult){
    req.flash(
      "notice",
      `Vehicle added to inventory.`
    )
    res.status(201).render("inventory/addVehicle", {
      title: "Add New Vehicle",
      nav,
      selection,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, vehicle failed to be added.")
    res.status(501).render("inventory/addVehicle", {
      title: "Add New Vehicle",
      nav,
      selection,
      errors: null
    })
  }
}

/*********************************************
 * Return Inventory by Classification As JSON
 *********************************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No Data returned"))
  }
}

/*****************************
 * Build edit view
 *****************************/
invCont.buildEditView = async function (req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const arrayData = await invModel.getDetailById(inv_id)
  const itemData = arrayData[0]
  let selection = await utilities.getSelection()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    selection: selection,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/*****************************
 * Update inventory
 ***************************/

invCont.updateInventory = async function(req, res, next) {

  let nav = await utilities.getNav()

  const {  inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,} = req.body

    console.log( 
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,)

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id, 
  )

  if(updateResult){
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice",`The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const selection = await utilities.getSelection(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit" + itemName,
      nav,
      selection,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    }
  }

  /************************
   * build delete view
   ***********************/
invCont.deleteView = async function (req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const arrayData = await invModel.getDetailById(inv_id)
  const itemData = arrayData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


/*****************************
 * Delete inventory
 ***************************/

invCont.deleteInv = async function(req, res, next) {


    inv_id = parseInt(req.body.inv_id)


  const deleteResult = await invModel.deleteInventory(
    inv_id, 
  )

  if(deleteResult){
    req.flash("notice",`The item was successfully deleted.`)
    res.redirect("/inv/")
  } else {
   
    req.flash("notice", "Sorry, the insert failed.")
    res.redirect(`inv/delete/${inv_id}`)
  
    }
  }


module.exports = invCont