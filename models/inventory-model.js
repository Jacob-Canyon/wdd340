const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/**********************************************************************
 * Get all inventory items and classification_name by classification_id
 **********************************************************************/
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/****************************************************************
 * Get details by inv_id
 *****************************************************************/

async function getDetailById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error){
    console.error("getDetailById error" + error)
  }
}

/*************************
 * Add new classification
 *************************/

async function addClassification(classification_name) {
  try{
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql,[classification_name])
  } catch(error){
    return error.message
  }
}

//check if class is 
async function checkExistingClassification(classification_name){
  try {
      const sql = "SELECT * FROM classification WHERE classification_name = $1"
      const email = await pool.query(sql, [classification_name])
      return email.rowCount
  } catch (error) {
      return error.message
  }
}

//add new vehicle

async function addVehicle(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, ){
  try {
      const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)" 
      return await pool.query(sql, [ inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
      return error.message
  }
}

//update new inventory

async function updateInventory(  
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
  classification_id, ){
  try {
      const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    
      const data = await pool.query(sql, [  
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
        inv_id
      ])
      return data.rows[0]
  } catch (error) {
      console.error("model error: " + error)
  }
}

//delete inventory  model
//update new inventory

async function deleteInventory(  
  inv_id ){
  try {
      const sql = "DELETE FROM inventory WHERE inv_id = $1"
      const data = await pool.query(sql, [ inv_id ])
      return data
  } catch (error) {
      console.error("DELETE: " + error)
  }
}

/**************************************
 * Add vehicle into the favorite list
 **************************************/

async function addToFavorites(inv_id, account_id) {
  try{
    const sql = "UPDATE favorite SET fav_list = ARRAY_APPEND(fav_list, $1) WHERE fav_id = $2"
    const data = await pool.query(sql,[inv_id, account_id])
    return data
  } catch (error) {
    console.error("Add Favorite: " + error)

  }
}

/**************************************
 * Get vehicles in the favorite list
 **************************************/

async function getFavList(account_id){
  
  const sql = "SELECT fav_list FROM favorite WHERE fav_id = $1"
  let favList = await pool.query(sql,[account_id])
  
  favList = favList.rows[0].fav_list
  if (favList.length > 0){
  const sql2 =  `SELECT * FROM inventory WHERE inv_id = ANY(ARRAY[${favList}])`
  const data = await pool.query(sql2)
  return data.rows
} 
else
{return []}
  
}

/**************************************
 * Remove Vehicles from favorite list
 **************************************/

async function removeFavorite(inv_id, account_id) {
  try{
  const sql = "UPDATE favorite SET fav_list = ARRAY_REMOVE(fav_list, $1) WHERE fav_id = $2"
  return await pool.query(sql,[inv_id, account_id])}
  catch (error){
    console.error("Remove Favorite: " + error)
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getDetailById, addClassification, checkExistingClassification, addVehicle, updateInventory, deleteInventory, addToFavorites, getFavList, removeFavorite}