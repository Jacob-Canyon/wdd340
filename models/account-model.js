const pool = require("../database/")

/***********************
 * Register new account
 ************************/

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'client') RETURNING *"
        
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]) 
    } catch (error) {
        return error.message
    }
}

/******************************
 * add favorite
 *******************************/

async function addFavortie(account_email) {

    try{
        const sql = "SELECT account_id FROM account WHERE account_email = $1"
        const accountData = await pool.query(sql,[account_email])
        
        console.log(accountData.rows[0].account_id)
        const account_id = accountData.rows[0].account_id
        const favorite = "INSERT INTO favorite (fav_id) VALUES ($1)"
        await pool.query(favorite, [account_id])
} catch (error) {
    return error.message
}
}

/***************************
 * Check for existing email
 ***************************/

async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rows[0]
    } catch (error) {
        return error.message
    }
}

/*****************************************
 * Return account data using email address
 *****************************************/

async function getAccountByEmail (account_email) {
    try{
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
            return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/*****************************************
 * Return account data using account id
 *****************************************/

async function getAccountById (account_id) {
    try{
        const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
            [account_id])

            return result.rows[0]
    } catch (error) {
        return new Error("No matching account" + error)
    }
}

/***********************
 * Update account info
 ************************/

async function updateAccount(account_firstname, account_lastname, account_email, account_id){
    console.log(account_id)
    try {
        const sql =   `UPDATE public.account
        SET account_firstname = $1, 
        account_lastname = $2,
        account_email = $3
        WHERE account_id = $4
        RETURNING *;
    `;
        const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
        return data.rows[0]
    } catch (error) {
        return error.message 
    }
}

/***************************
 * Check update to see if email is already assigned to an account
 ***************************/
async function checkDoubleEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rows[0]
    } catch (error) {
        return error.message
    }
}

/***********************
 * Register new account
 ************************/

async function passwordUpdate(account_password, account_id){
    try {
        const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2" 
        return await pool.query(sql, [account_password, account_id])
    } catch (error) {
        return error.message
    }
}


module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, checkDoubleEmail, passwordUpdate, addFavortie }