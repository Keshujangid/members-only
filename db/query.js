const pool = require('../db/pool')


async function storeUser(userObj , hashedPassword) {
    try {
        await pool.query('insert into users (first_name, last_name, username, password) values ($1, $2, $3, $4)',[userObj.firstname ,userObj.lastname , userObj.username , hashedPassword])
        console.log('data entered successfully')
    } catch (error) {
      throw error
    }
}

async function checkUniqueUser(username){
    try {
        const {rows} = await pool.query('select * from users where username = $1',[username])
        if(rows.length > 0){
            return true
        }
        return false
    } catch (error) {
        throw error
    }
}

async function addMessage(messageObj){
    try {
        await pool.query('insert into messages (title, body, username) values ($1, $2, $3)',[messageObj.title , messageObj.body, messageObj.username])
        console.log('message added successfully')
    } catch (error) {
        throw error
    }
    
}

async function getAllMessages() {
    try {
        const response = await pool.query('select * from messages');
        return response.rows;

    } catch (error) {
        console.error(error);
    }
}

async function updateMembership(userId){
    try {
        await pool.query('update users set membership_status = true where id = $1',[userId])
        console.log('membership updated successfully')
    } catch (error) {
        throw error
    }
    
}

async function updateAdminStatus(userId){
    try {
        updateMembership(userId);
        await pool.query('update users set admin = true where id = $1',[userId])
        console.log('admin status updated successfully')
    } catch (error) {
        throw error
    }
    
}

async function deleteMessage(messageId){
    try {
        await pool.query('delete from messages where id = $1',[messageId])
        console.log('message deleted successfully')
    } catch (error) {
        throw error
    }
    
}


module.exports = {
    storeUser,
    checkUniqueUser,
    addMessage,
    getAllMessages ,
    updateMembership,
    updateAdminStatus,
    deleteMessage
}