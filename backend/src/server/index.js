import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import rutes from '../rutes/rutes.js'
import { db } from '../models/turso/turso.js';

const PORT = process.env.PORT ?? 3000

const app = express()
app.use(express.json())
const server = createServer(app)
const io = new Server(server,{
    connectionStateRecovery:{}
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

app.use('/chat', rutes)

app.get('/', (req,res)=>{
    res.send('Welcome chat Danidev')
})

server.listen(PORT, ()=>{
    console.log(`escuchando en el puerto ${PORT}`)
})