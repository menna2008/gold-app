import { NavLink } from 'react-router-dom';
import styles from './Home.module.css';
import Header from './Header';

const Home = () => {

    return (
        <div className={styles.body}>
            <Header />
            <div className={styles.landing_page}>
                <h1>Welcome To Precious Metals Price Prediction!</h1>
                <p className={styles.info}>This website is where you can get better insight when investing in gold, silver, platinum, and palladium!</p>
                <p className={styles.info}>Different models are trained for each type of metal, due to their different trends.</p>
                <p className={styles.warning}>Models do not have 100% accuracy so use them as a guide rather than a guarantee.</p>
                <div className={styles.prediction_link_container}>
                    <NavLink to='/prediction' className={styles.prediction_link}>Make Prediction</NavLink>
                </div>
            </div>
        </div>
  );
}

export default Home;
