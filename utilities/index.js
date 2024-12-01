const invModel = require("../models/inventory-model")
const Util = {}

/****************************************
 * Construsts the nav HTML unordered list
 ****************************************/
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +='<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
            list += "</li>"
    })
    list += "</ul>"
    return list
}

/***********************************
 * Build the classification view HTML
 ************************************/
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length >0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a class="classificationImg" href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/*******************************************
 * Build detail grid view HTML
 ********************************************/

Util.buildDetailGrid = async function(vehicle){
    let grid
        grid = '<div id="detail-display">'
        grid += '<img src="' + vehicle.inv_image +'" alt="Image of' + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors">'
        grid += '<ul>'
        grid += '<li> Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
        grid += '<li> Miles: ' + vehicle.inv_miles.toLocaleString('en', {useGrouping:true}) + '</li>'
        grid += '<li> Year: ' + vehicle.inv_year + '</li>'
        grid += '<li> Color: ' + vehicle.inv_color + '</li>'
        grid += '<li> Description: ' +vehicle.inv_description + '</li>'
        grid += '</ul>'
        grid += '</div>'
        return grid
}

/**********************************
 * Build Selection for add vehicle
 **********************************/

Util.getSelection = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
    '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
          ) {
            classificationList += " selected "
          }
          classificationList += ">" + row.classification_name + "</option>"
        })
    classificationList += "</select>"
    return classificationList
    
}

/********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 *********************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util