import express from 'express';
import { validateLogin, validateToken, validateUser } from '../schemas/chats.js';
import { getAll, createMessage, registerUser, loginUser, getInfo, update} from '../contorllers/controllers.js';
import { randomUUID } from 'node:crypto';

const router = express.Router()

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

router.get('/profile/:userName', validateToken ,async (req,res)=>{
    const name = req.params.userName

    const result = await getInfo(name)
    if(result.success){
        res.status(result.state).send({user: result.user, image: result.image})
    }else{
        res.status(result.state).send({message: result.message})
    }
})

router.put('/profile/:userName', validateToken ,async (req, res)=>{
    const userName = req.params.userName;
    const { image } = req.body;

    const result = await update(userName, image)

    if(result.success){
        res.status(result.state).send({image: result.data, message: result.message})
    }else{
        res.status(result.state).send(result.message)
    }
})

export default router