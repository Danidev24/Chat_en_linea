//aqui realizamos la conexión a la base de datos en turso

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const db = createClient({
    url: process.env.URL,
    authToken: process.env.DB_TOKEN
})

const getMessages = async ()=>{
    try{
        const data = await db.execute(`SELECT * FROM messages`)
    
        if(data.rows.length > 0){
            return { success: true, data}
        }else{
            return { success: false, message: 'message not found'}
        }
    }catch(e){
        return { success: false, message: 'Internal server error'}
    }
    
}

const create = async (ms)=>{
    try{
        const result  = await db.execute({
            sql: 'INSERT INTO messages(content) VALUES(?)',
            args: [ms]
        })
    
        return { success: true, data: result.data, message:'Send successful', data: ms}

    }catch(error){
        return { success: true, message: 'Interval server error'}
    }
}

const findUser = async (user) =>{
    try{
        const find =  await db.execute({
            sql: `SELECT * FROM users WHERE user = ?`,
            args: [user]
        })
        if(find.rows.length > 0){
            return {success: true, data:find.rows[0].password}
        }else{
            return {success: false, message: 'Wrong password or username', state: 401}
        }
    }catch(error){
        return {success: false, message: 'Internal server error', state: 500}
    }
}


const register = async (id, user, password) =>{
    try{
        const saveUser = db.execute({
            sql: `INSERT INTO users(id, user, password) VALUES(?,?,?)`,
            args: [id, user, password]
        })
    
        return {success: true, message: 'Successfully created'}
    }catch(error){
        return {success: false, message: 'Internal server error'}
    }
}


const login =async  (user)=>{
    try{
        const token = jwt.sign(user, process.env.JWT)

        const object = {
            message: 'Login successful',
            user:user,
            token
        }

        return {success: true, token: object.token, message: 'Successful login',state:200 }

    }catch(error){
        return {success: false, message: 'Internal server error', state: 500}
    }
}

export {
    db,
    getMessages,
    create,
    findUser,
    register,
    login

}