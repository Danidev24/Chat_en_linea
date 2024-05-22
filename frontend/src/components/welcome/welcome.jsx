import React from "react";
import { Link } from "react-router-dom";
import './welcome.css'

const Welcome = ()=>{
    return(
        <>
        <div className="containerWelcome">
          <nav>
            <div>
              <ul>
                <li>
                  <Link to='/Login'>login</Link>
                </li>
                <li>
                  <Link to='/Register'>Register</Link>
                </li>
              </ul>
            </div>
          </nav>

          <section>
            <h2>Welcome to DaniChat for developers</h2>
            <p>
              DaniChat is a personal project created to be used by the community 
              of developers in the world, to talk about technology and everything related 
              to the subject of software development, if you are passionate about technology 
              and meet people with the same passion, I invite you to register and start in 
              this fun adventure.
            </p>
          </section>
        </div>
        
        </>
    )
}

export default Welcome