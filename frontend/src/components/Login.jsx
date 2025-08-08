import { useState } from "react";
import Header from "./header";
import person from "../assets/person.png";
import './UserManagement.css';
import { NavLink } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    {/* Handles loging in user */}
    const login = async (e) => {
        e.preventDefault();

        {/* sends a request to the login view in djangoapp */}
        let url = window.location.origin + '/djangoapp/login';
        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify({
                'username' : username,
                'password' : password,
            })
        });

        {/* Checks if the user is authenticated */}
        res = await res.json();
        if (res.status === 'authenticated') {
            {/* User is authenticated and returns to the home page */}
            sessionStorage.setItem('username', username);
            window.location.href = window.location.origin;
        } else {
            {/* User is not logged in, they stay on the login page */}
            alert(res.status);
        }
    }

    return (
        <div>
            <Header />
            <div className='container'>
                <form className='form' onSubmit={login}>
                    <h3>Login</h3>
                    <div className='input-group'>
                        <img src={person} alt=""></img>
                        <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <img src={person} alt=""></img>
                        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <input className="submit-button" type="submit" value="Login" />
                    <NavLink to='/register' className='nav_link'>Register</NavLink>
                </form>
            </div>
        </div>
    )
}

export default Login;