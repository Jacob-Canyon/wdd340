const utilities = require("../utilities/")
const errorController = {}

errorController.buildHome = async function(req, res){
    //const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}

module.exports = errorController