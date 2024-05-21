// aqui es donde creamos las funciones leer, crear, actualizar, 
//y llamamos las funciones de la base de datos que se encuentran en modelos

import {get, create, register, findUser, login} from '../models/turso/turso.js'


const getAll = async ()=>{

    const result = await get()
    if(result.success){
        return {success: true, data: result.data}
    }else{
        return result.message
    }
}

const createMessage = async (message)=>{
    try{
        const ms = message.content

        const result = await create(ms)
        if(result.success){
            return {success: true, data: result.data}
        }else{
            return { success: false, error: 'Error creating message'}
        }
    }catch(error){
        return { success: false, error: error.message}
    }
}

const registerUser = async (id, user, password)=>{

    const find =  await findUser()

    if(find.success){
        return {success: false}
    }

    const saveUser = await register(id, user, password);

    if(saveUser.success){
        return {success: true, saveUser}
    }
}

const loginUser = async (user, password)=>{
    const find = await findUser(user)
    
    if(find.success){
        if(find.data === password){
            const result = await login(user, password)
            return result
        }else{
            return {success: false, state:401, message:'Wrong password or username'}
        }
    }else{
        return find
    }
}

export {
    getAll, createMessage, registerUser, loginUser
}

