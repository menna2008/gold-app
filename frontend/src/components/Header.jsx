import { NavLink, useNavigate } from 'react-router-dom'
import metals_icon from "../assets/metals.png";
import styles from './Header.module.css';

const Header = () => {

    const navigate = useNavigate()

    const logout = async () => {
        const logout_url = 'http://127.0.0.1:8000/djangoapp/logout';
        console.log(sessionStorage.getItem('token'));
        const res = await fetch(logout_url, {
            method: "POST",
            headers: {
                'Authorization': 'Token ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })

        const data = await res.json();
        if (data.status === 'logged out') {
            let username = sessionStorage.getItem('username');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('token');
            alert("Logging out "+username+"...");
            navigate('/')
        }
        else {
            alert("The user could not be logged out.");
        }
    }

    let curr_user = sessionStorage.getItem('username');
    let nav_links;
    if (curr_user) {
        nav_links = <div className={styles.nav_links}>
                        <NavLink to='/' className={styles.nav_link}>Home</NavLink>
                        <NavLink to='/past_predictions' className={styles.nav_link}>Past Predictions</NavLink>
                        <NavLink to='/' className={styles.nav_link} onClick={logout}>Logout</NavLink>
                    </div>;
    } else {
        nav_links = <div className={styles.nav_links}>
                        <NavLink to='/' className={styles.nav_link}>Home</NavLink>
                        <NavLink to='/login' className={styles.nav_link}>Login</NavLink>
                        <NavLink to='/register' className={styles.nav_link}>Register</NavLink>
                    </div>;
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.left}>
                <img src={metals_icon} alt="" />
                <h3>Precious Metals Price Predictions</h3>
            </div>
            {nav_links}
        </div>
    )
}

export default Header;
