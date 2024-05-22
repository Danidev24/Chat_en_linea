import {React, useState} from "react";
import './login.css'

const Login = ()=>{

  const [userName,setUserName] = useState('')
  const [password, setPassword] = useState('')

    return(
        <>
          <div className="containerLogin">
            <h1>
              Login
            </h1>
            <form action="" method="post">
              <label>User: </label>
              <input type="text" name="userName"/>
              <label>Password: </label>
              <input type="password" name="password"/>
              <input type="submit" value="Login"/>
            </form>
          </div>
        </>
    )
}

export default Login