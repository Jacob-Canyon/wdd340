
require("dotenv").config()
const static = require("./routes/static")
const session = require("express-session")
const pool = require('./database/')

function addFavorite(inv_id, account_id){
    addToFavorites(inv_id, account_id)
}


async function addToFavorites(inv_id, account_id) {
    try{
      const sql = "UPDATE favorite SET fav_list = ARRAY_APPEND(fav_list, $1) WHERE fav_id = $2"
      const data = await pool.query(sql,[inv_id, account_id])
      return data
    } catch (error) {
      console.error("Add Favorite: " + error)
  
    }
  }