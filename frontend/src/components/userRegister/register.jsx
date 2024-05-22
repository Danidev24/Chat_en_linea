import {React, useState} from "react";
import './register.css'

const Register = ()=>{

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')

    return(
        <>
          <div className="containerRegister">
            <h1>
              Register
            </h1>
            <form action="" method="post">
              <label>User: </label>
              <input type="text" name="userName"/>
              <label>Password: </label>
              <input type="password" name="password"/>
              <label>Confirm Password: </label>
              <input type="password" name="password"/>
              <input type="submit" value="Register"/>
            </form>
          </div>
        </>
    )
}

export default Register