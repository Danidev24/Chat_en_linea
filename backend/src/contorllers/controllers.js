// aqui es donde creamos las funciones leer, crear, actualizar, 
//y llamamos las funciones de la base de datos que se encuentran en modelos

import {getMessages, create, register, findUser, login, getInfoProfile, updateInfo} from '../models/turso/turso.js'


const getAll = async ()=>{

    const result = await getMessages()
    if(result.success){
        return result
    }else{
        return result
    }
}

const createMessage = async (message)=>{

    const ms = message.content

    const result = await create(ms)
    if(result.success){
        return result
    }else{
        return result
    }
}

const registerUser = async (id, user, password)=>{

    const find =  await findUser()

    if(find.success){
        return {success: false}
    }

    const saveUser = await register(id, user, password);

    if(saveUser.success){
        return saveUser
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

const getInfo = async (name)=>{
    const username = await findUser(name)
    if(username.success){
        const result = await getInfoProfile(name)
        return result
    }else{
        return {success: false, message: 'User does not exist', state: 404}
    }
    
}

const update = async (userName, image)=>{

    const find = await findUser(userName)
    if(find.success){
        const result = await updateInfo(userName, image)
        if(result.success){
            return result
        }
    }else{
        return {success: false, state: 400, message: 'Not found user'}
    }
}

export {
    getAll, createMessage, registerUser, loginUser, getInfo, update
}