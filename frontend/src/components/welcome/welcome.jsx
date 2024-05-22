import React from "react";
import { Link } from "react-router-dom";

const Welcome = ()=>{
    return(
        <>
          <nav>
            <div>
              <a href="" className="nav-logo">logo</a>
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

          
        </>
    )
}

export default Welcome