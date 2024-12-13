const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
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
    let grid = ""
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

Util.buildDetailGrid = async function(vehicle, account_id){
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
        grid += '<form id="addFavForm" action="/inv/detail/' + vehicle.inv_id
            + '" method="post">'
        grid += '<input="hidden" name="account_id" value="'+ account_id +'" pattern="[0-9]"/>'
        grid += '<input="hidden" name="inv_id" value="'+ vehicle.inv_id +'" pattern="[0-9]"/>'
         grid += '<input id="submit" type="submit" value="Add favorite">'
        grid += '</form>'
        grid += '</div>'


        return grid
}

/***************************************
 * no log in detail grid
 */

Util.buildNoLogDetailGrid = async function(vehicle){
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

/*************************************
 * Middleware to check token validity
 *************************************/
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

/*************************************
 * Middleware to check token for account type
 *************************************/
Util.checkJWTAccount = (req, res, next) => {
    
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                res.locals.accountData = accountData
                if (err) {
                    req.flash("Please log in")
                    return res.redirect("/account/login")
                }
                if(accountData.account_type == "admin"){
                    res.locals.accountData = accountData
                    res.locals.accessLevel = 3
                }
                if(accountData.account_type == "employee"){
                    res.locals.accountData = accountData
                    res.locals.accessLevel = 2
                }

                if(accountData.account_type == "client") {
                    res.locals.accountData = accountData
                    res.locals.accessLevel = 1
                }
                
                next()
            })
    } else {
        next()
    }
}

    
/*************************
 * Check Login
 ***************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        req.flash("You have access")
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/*************************
 * Check Access Level
 ***************************/
Util.checkAccess = (req, res, next) => {
    if (res.locals.accessLevel > 1) {
        next()
    } else {
        req.flash("notice", "Access Denied")
        return res.redirect("/account/login")
    }
}

/***********************************
 * Build the favorite grid view HTML
 ************************************/
Util.buildFavoriteGrid = async function(data){
    let grid = ""
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a class="classificationImg" href="../../inv/favDetail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/favDetail/' + vehicle.inv_id +'" title="View '
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
        grid += '<p class="notice">Sorry, no matching favorites.</p>'
    }
    return grid
}

/*******************************************
 * Build detail grid view HTML
 ********************************************/

Util.buildFavDetailGrid = async function(vehicle, account_id){
    
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
        grid += '<form id="addFavForm" action="/inv/favDetail/' + vehicle.inv_id
            + '" method="post">'
        grid += '<input="hidden" name="account_id" value="'+ account_id +'" pattern="[0-9]"/>'
        grid += '<input="hidden" name="inv_id" value="'+ vehicle.inv_id +'" pattern="[0-9]"/>'
        grid += '<input id="submit" type="submit" value="Remove favorite">'
        grid += '</form>'
        grid += '</div>'
    

        return grid
}



module.exports = Util