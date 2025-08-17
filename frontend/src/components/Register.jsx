import { useState } from "react";
import Header from "./Header";
import styles from './UserManagement.module.css'
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const register = async (e) => {
        e.preventDefault();
        const url = 'http://127.0.0.1:8000/djangoapp/register';
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
            sessionStorage.setItem('token', res.token);
            navigate('/');
        } else {
            alert(res.message);
        }
    }

    return (
        <div className={styles.body}>
            <Header />
            <div className={styles.container}>
                <form className={styles.form} onSubmit={register}>
                    <h1>Register</h1>
                    <div className={styles.input_group}>
                        <input type="text" name="first_name" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input type="text" name="last_name" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <input className={styles.submit_button} type="submit" value="Register" />
                    <p>Already have an account? <Link to='/login' className={styles.link}>Login</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Register;