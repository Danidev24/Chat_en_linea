import React from "react";
import './chat.css'

const Chat = ()=>{
    return(
        <>
          <div>
            <section id="chat">
              <ul id="messages"></ul>
              <form id="form">
                <input 
                  type="text"
                  name="message"
                  id="input"
                  placeholder="Type a message"
                  autocomplete="off"/>
                <button type="submit">Enviar</button>
              </form>
            </section>
          </div>
        </>
    )
}

export default Chat