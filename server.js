/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/


/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const session = require("express-session")
const pool = require('./database/')
const baseController = require("./controllers/baseController")
const invController = require("./controllers/invController")
const utilities = require("./utilities/")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const errorController = require("./controllers/errorController")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/****************************
 * Middleware
 ****************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
app.use(bodyParser.json())
//for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//Express Message Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(cookieParser())
// check token middleware
app.use(utilities.checkJWTToken)
app.use(utilities.checkJWTAccount)

/* ***********************
 *View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Routes
 *************************/

app.use(static)
app.get("/", utilities.handleErrors(baseController.buildHome))
//inventory route
app.use("/inv/type", inventoryRoute)
app.use("/inv", inventoryRoute)
//details route,
app.use("/inv/detail",utilities.checkLogin, inventoryRoute)
//account route
app.use("/account", accountRoute)
app.use("/account/register", accountRoute)
app.use("/account/accountManagement", accountRoute)
app.use("/account/accountUpdate", accountRoute)
//route for error link
app.use("/error", utilities.handleErrors(errorController.buildHome))
//error routes

//File Not Found Route - must be last
app.use(async(req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/************************
 * Express Error Handler
 * Place after all other middleware
 ************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){message = err.message} else {message = 'Oh no!There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
