import express from 'express';
import { validateLogin, validateToken, validateUser } from '../schemas/chats.js';
import { getAll, createMessage, registerUser, loginUser} from '../contorllers/controllers.js';
import { randomUUID } from 'node:crypto';
import { findUser } from '../models/turso/turso.js';

const router = express.Router()

router.get('/', validateToken, async(req, res)=>{
    const result = await getAll()

    if(result.success){
        res.json(result.data)
    }else{
        res.status(404).send(result.message)
    }
})

router.post('/', validateToken, async(req,res)=>{

    const msg = req.body;

    const result = await createMessage(msg);

    if(result.success){
        res.status(200).json({message: result.message, body: msg})
    }else{
        res.status(500).json({message: result.message})
    }
})

router.post('/register', async (req,res) =>{
    const id = randomUUID()
    const validate = validateUser(req.body)
    const {user, password } = req.body;
    

    if (!validate.success) {
        return res.status(400).json({ error: JSON.parse(validate.error.message)});
    }

    const response = await registerUser(id, user, password);

    if(response.success){
        res.status(201).json({ message: response.message, data: user })
    }else{
        res.status(500).json({error: response.message})
    }
})

router.post('/login', async (req, res)=>{
    const {user, password} = req.body;
    const validate = validateLogin(req.body)

    if (!validate.success) {
        return res.status(400).json({ error: JSON.parse(validate.error.message)});
    }else{
        const resul = await loginUser(user, password)

        if(resul.success){
            res.status(resul.state).json({token: resul.token, message: resul.message})
        }else{
            res.status(resul.state).send(resul.message)
        }
    }
})

router.get('/profile/:userName', async (req,res)=>{
    const result = await findUser()

    if(result.success){
        
    }
})
export default router