import { useEffect, useState } from "react";
import Header from "./Header";
import styles from './UserManagement.module.css';
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const username = sessionStorage.getItem('username')
        if (username) {
            alert ('You are already logged in')
            navigate('/')
        }
    }, [])

    {/* Handles loging in user */}
    const login = async (e) => {
        e.preventDefault();

        {/* sends a request to the login view in djangoapp */}
        let url = 'http://127.0.0.1:8000/djangoapp/login';
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
            sessionStorage.setItem('token', res.token);
            navigate('/');
        } else {
            {/* User is not logged in, they stay on the login page */}
            alert(res.message);
        }
    }

    return (
        <div className={styles.body}>
            <Header />
            <div className={styles.container}>
                <form className={styles.form} onSubmit={login}>
                    <h1>Login</h1>
                    <div className={styles.input_group}>
                        <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <input className={styles.submit_button} type="submit" value="Login" />
                    <p>Don't have an account? <NavLink to='/register' className={styles.link}>Register</NavLink></p>
                </form>
            </div>
        </div>
    )
}

export default Login;