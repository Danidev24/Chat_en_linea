// aqui creamos las validaciones para el registro y login con zod

import zod from 'zod'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

const validateData = zod.object({
    user: zod.string({
        invalid_type_error: 'User must be a string.',
        required_error: 'User is requerid.'
    })
    .min(
        6, 
        { invalid_type_error: 'The user must have a minimum of 6 characters' }
    )
    .regex(
        /^[a-zA-Z0-9]+$/,
        { message: 'The user cannot have special characters, only numbers and letters'}
    ),

    password: zod.string({
        invalid_type_error: 'Password must be a string.',
        required_error: 'Password is requerid.'
    })
    .min(
        8,
        { invalid_type_error: 'The password must have a minimum of 8 characters' }
    )
    .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/, 
        { message: 'The password must have at least one special character, a number, and a letter'}
    ).max(
        12,
        { invalid_type_error:'The password cannot be more than 12 characters' }
    )
})

export const validateToken =(req,res,next)=>{
    const accessToken = req.headers['authorization']

    if(!accessToken){
        return res.status(401).json({ error: 'Access denied or not access token provided.'})
    }

    const token = accessToken.substring(7)

    jwt.verify(token, process.env.JWT, (err, decoded)=>{
        if(err){
            console.log(err)
            return res.status(403).json({error: 'Token expired or incorrect.'})
        }

        next()
    })
}

export const validateUP= zod.object({
    user: zod.string({
        invalid_type_error: 'User must be a string.',
        required_error: 'User is requerid.'
    }),

    password: zod.string({
        invalid_type_error: 'Password must be a string.',
        required_error: 'Password is requerid.'
    })
})

export const validateUser = (data)=>{
    return validateData.safeParse(data)
}

export const validateLogin = (data)=>{
    return validateUP.safeParse(data)
}