import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import { randomUUID } from 'node:crypto';
import { validateUser, validateToken } from '../schemas/chats.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const PORT = process.env.PORT ?? 3000

const app = express()
app.use(express.json())
const server = createServer(app)
const io = new Server(server,{
    connectionStateRecovery:{}
})


const db = createClient({
    url: process.env.URL,
    authToken: process.env.DB_TOKEN
})

await db.execute(`
    CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT
    )
`)

await db.execute(`
    CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY NOT NULL,
        user VARCHAR(45) NOT NULL,
        password VARCHAR(45) NOT NULL,
        image BLOB
    )
`)

io.on('connection', async (socket)=>{
    console.log('Un usuario se ha conectado')
    
    socket.on('disconnect',()=>{
        console.log('un usuario se desconectó')
    })

    socket.on('chat message', async (msg)=>{
        let result
        try{
            result  = await db.execute({
                sql: 'INSERT INTO messages (content) VALUES (:msg)',
                args: { msg }
            })

            
            io.emit('chat message', msg, result.lastInsertRowid.toString())

        }catch(e){
            console.error('error: ', e)
            return
        }
    })

    if(!socket.recovered){
        try{
            const result = await db.execute({
                sql: 'SELECT id, content FROM messages WHERE id > ?',
                args: [socket.handshake.auth.serverOffset ?? 0]
            })

            result.rows.forEach(row => {
                socket.emit('chat message', row.content, row.id.toString())
            });
        }catch (e){
            console.error('no se pudieron recuperar los mensajes', e)
            return
        }
    }
})

app.use(logger('dev'))

app.get('/chat', validateToken, async (req,res)=>{
    const data = await db.execute(`SELECT * FROM messages`)

    if(data.rows.length > 0){
        res.json(data);
    }else{
    res.send('Not found messages')
    }
})

app.post('/chat', async(req,res)=>{
    const msg = req.body;

    console.log(msg)

    let result;
    try{
        result  = await db.execute({
            sql: 'INSERT INTO messages(content) VALUES(?)',
            args: [msg.content]
        })
        res.send('send succesfully')

    }catch (err){
        console.error('Error al agregar datos.', err);
        res.status(500).send('Error al agregar datos');
    }
})

// app.get('/', (req,res)=>{
//     res.send('Estamos en la pagina principal')
// })

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/src/client/index.html')
  })

app.post('/chat/register', async (req,res)=>{

    const id = randomUUID()
    const result = validateUser(req.body)
    const {user, password } = req.body;

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message)});
    }

    try{
        console.log('entramos acá')
        const find =  await db.execute({
            sql: `SELECT * FROM users WHERE user = ?`,
            args: [user]
        })

        if(find.rows.length > 0){
            return res.json('User already exists')
        }

        const save = db.execute({
            sql: `INSERT INTO users(id, user, password) VALUES(?,?,?)`,
            args: [id, user, password]
        })

        res.status(201).json({ message: 'user created successfully', data: save })

    }catch(error){
        console.log('error: ', error)
    }
})

app.post('/chat/login', async (req,res)=>{
    const {user, password} = req.body;
    const pass = password;

    try{
        const find  = await db.execute({
            sql: `SELECT * FROM users WHERE user=?`,
            args: [user]
        })


        if(find.rows.length === 0 || pass != find.rows[0].password){
            return res.status(404).json('User not found or invalid password')
        }

        const userForToken = {
            user: find.rows[0].user
        }

        // const time = '24h'
        const token = jwt.sign(userForToken, process.env.JWT)

        return res.send({
            message: 'Login successful',
            user : find.rows[0].user,
            token
        })
    }catch(error){
        console.log('error', error)
        res.status(500).json({ error: 'Internal server error' })
    }
    
})

app.get('/chat/profile/:userName', async (req, res)=>{
    const name = req.params.userName;
    try{
        const user = await db.execute({
            sql: `SELECT * FROM users WHERE user=?`,
            args: [name]
        })
        res.json({
            user: user.rows[0].user,
            image: user.rows[0].image
        });
    }catch (err){
        console.log('error: ', err)
        res.send('error')
    }
})

app.put('/chat/profile/:idUser', async (req, res)=>{
    const id = req.params.idUser;
    const { image } = req.body;

    try{
        const result = await db.execute({
            sql: `UPDATE users SET image=? WHERE id=?`,
            args:[image, id]
        })
        console.log('update succesfully', result)
        res.json('Update succesfully')
    }catch(e){
        console.log('error: ', e)
        res.send('error')
    }
})

server.listen(PORT, ()=>{
    console.log(`escuchando en el puerto ${PORT}`)
})