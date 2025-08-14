import { NavLink } from 'react-router-dom';
import './Home.css';
import Header from './Header';

const Home = () => {

    return (
        <div className='body'>
            <Header />
            <div className='landing_page'>
                <h1>Welcome To Precious Metals Price Prediction!</h1>
                <p className='info'>This website is where you can get better insight when investing in gold, silver, platinum, and palladium!</p>
                <p className='info'>Different models are trained for each type of metal, due to their different trends.</p>
                <p className='warning'>Models do not have 100% accuracy so use them as a guide rather than a guarantee.</p>
                <div className='prediction_link_container'>
                    <NavLink to='/prediction' className='prediction_link'>Make Prediction</NavLink>
                </div>
            </div>
        </div>
  );
}

export default Home;