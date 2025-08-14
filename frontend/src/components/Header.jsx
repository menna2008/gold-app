import { NavLink, useNavigate } from 'react-router-dom'
import metals_icon from "../assets/metals.png";
import './Header.css';

const Header = () => {

    const navigate = useNavigate()

    const logout = async (e) => {
        const logout_url = 'http://127.0.0.1:8000/djangoapp/logout';
        const res = await fetch(logout_url, {
            method: "GET",
        })

        const json = await res.json();
        console.log(json)
        if (json) {
            let username = sessionStorage.getItem('username');
            sessionStorage.removeItem('username');
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
        nav_links = <div className='nav_links'>
                        <NavLink to='/' className='nav_link'>Home</NavLink>
                        <NavLink to='/past_predictions' className='nav_link'>Past Predictions</NavLink>
                        <NavLink to='/' className='nav_link' onClick={logout}>Logout</NavLink>
                    </div>;
    } else {
        nav_links = <div className='nav_links'>
                        <NavLink to='/' className='nav_link'>Home</NavLink>
                        <NavLink to='/login' className='nav_link'>Login</NavLink>
                        <NavLink to='/register' className='nav_link'>Register</NavLink>
                    </div>;
    }

    return (
        <div className="navbar">
            <div className='left'>
                <img src={metals_icon} alt="" />
                <h3>Precious Metals Price Predictions</h3>
            </div>
            {nav_links}
        </div>
    )
}

export default Header;