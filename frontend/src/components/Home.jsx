import { NavLink } from 'react-router-dom';
import './Home.css';
import Header from './header';

const Home = () => {

    return (
        <div className='body'>
            <Header />
            <div className='landing_page'>
                <h1>Welcome To Precious Metals Price Prediction!</h1>
                <p>This website is where you can get better insight when investing in gold, silver, platinum, and palladium!</p>
                <p>Different models are trained for each type of metal, due to their different trends.</p>
                <div className='nav_link_box'>
                    <NavLink to='/prediction' className='nav_link'>Make Prediction</NavLink>
                </div>
            </div>
        </div>
  );
}

export default Home;