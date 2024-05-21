//aqui realizamos la conexión a la base de datos en turso

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const db = createClient({
    url: process.env.URL,
    authToken: process.env.DB_TOKEN
})

const get = async ()=>{
    try{
        const data = await db.execute(`SELECT * FROM messages`)
    
        if(data.rows.length > 0){
            return { success: true, data}
        }else{
            return { success: false, error: new Error('No messages found')}
        }
    }catch(e){
        return { success: false, error: e}
    }
    
}

const create = async (ms)=>{
    try{
        const result  = await db.execute({
            sql: 'INSERT INTO messages(content) VALUES(?)',
            args: [ms]
        })
    
        return { success: true, data: result.data}

    }catch(error){
        return { success: true, error: error.message}
    }
}

const findUser = async (user) =>{
    console.log('entramos a finduser: ', user)
    try{
        const find =  await db.execute({
            sql: `SELECT * FROM users WHERE user = ?`,
            args: [user]
        })
        if(find.rows.length > 0){
            console.log('retorna succes true')
            return {success: true, data:find.rows[0].password}
        }else{
            return {success: false, message: 'Wrong password or username', state: 401}
        }
    }catch(error){
        return {success: false, message: 'Internal server error', state: 500}
    }
}


const register = (id, user, password) =>{
    try{
        const saveUser = db.execute({
            sql: `INSERT INTO users(id, user, password) VALUES(?,?,?)`,
            args: [id, user, password]
        })
    
        return {success: true}

    }catch(error){
        return error
    }
    
}


const login =async  (user)=>{
    console.log('entramos a login: ', user)
    try{
        const token = jwt.sign(user, process.env.JWT)

        const object = {
            message: 'Login successful',
            user:user,
            token
        }

        console.log('objeto del login: ', object.token)

        return {success: true, token: object.token, message: 'Successful login',state:200 }

    }catch(error){
        return {success: false, message: 'Internal server error', state: 500}
    }
}

export {
    db,
    get,
    create,
    findUser,
    register,
    login

}