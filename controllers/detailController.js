const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const detailCont = {}

detailCont.buildDetailById = async function (req, res, next) {
    const inv_id = req.params.inv_id
    console.log(inv_id)
    const data = await invModel.getDetailById(inv_id)
    const grid = await utilities.buildDetailById(data[0])
    let nav = await utilities.getNav()
    const name = data[0].inv_make + ' ' + data[0].inv_model
    res.render("./inventory/detail", {
        title: name,
        nav,
        grid,
    })
}

module.exports = detailCont