import { useState } from "react";
import Header from "./header";
import person from "../assets/person.png";
import './UserManagement.css'
import { NavLink } from "react-router-dom";

const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const register = async (e) => {
        e.preventDefault();
        const url = window.location.origin + '/djangoapp/register'
        let res = await fetch(url, {
            method : 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify({
                'first_name' : firstName,
                'last_name' : lastName,
                'email' : email,
                'username' : username,
                'password' : password,
            })
        });

        res = await res.json();
        if (res.status === 'registered') {
            sessionStorage.setItem('username', username);
            window.location.href = window.location.origin;
        } else {
            alert(res.status);
        }
    }

    return (
        <div>
            <Header />
            <div className='container'>
                <form className='form' onSubmit={register}>
                    <h3>Register</h3>
                    <div className='input-group'>
                        <img src={person} alt=""></img>
                        <input type="text" name="first_name" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <img src={person} alt=""></img>
                        <input type="text" name="last_name" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <img src={person} alt=""></img>
                        <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <img src={person} alt=""></img>
                        <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <img src={person} alt=""></img>
                        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <input className="submit-button" type="submit" value="Register" />
                    <NavLink to='/login' className='nav_link'>Login</NavLink>
                </form>
            </div>
        </div>
    )
}

export default Register;