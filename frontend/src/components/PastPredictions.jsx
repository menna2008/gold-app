import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import styles from './PastPredictions.module.css';
import delete_icon from '../assets/delete_icon.png';
import Header from "./Header";
import { options, LineData } from './Prediction';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const PastPredictions = () => {

    const [pastPredictions, setPastPredictions] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null)
    const username = sessionStorage.getItem('username')
    const navigate = useNavigate()

    const toggleIndex = (index) => {
        expandedIndex === index ? setExpandedIndex(null) : setExpandedIndex(index)
    }

    const handleDelete = async (id) => {
        const url = `http://127.0.0.1:8000/djangoapp/past_predictions`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Token ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': id
            })
        });
        if (res.ok) {
            setPastPredictions(pastPredictions.filter(prediction => prediction.id !== id));
        }
    }

    useEffect(() => {
        const fetchPastPredictions = async () => {
            const url = `http://127.0.0.1:8000/djangoapp/past_predictions`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setPastPredictions(data.predictions);
            } else {
                alert(data.message);
            }
        };

        if (!username) {
            alert('You must be logged in to view past predictions')
            navigate('/login')
        } else {
            fetchPastPredictions();
        }
    }, [username, navigate]);

    return (
        <div className={styles.body}>
            <Header />
            <div className={styles.past_predictions}>
                <h1>Past Predictions</h1>
                <div className={styles.prediction_box}>
                {pastPredictions.length > 0 ? 
                    <div className={styles.prediction_list}>
                    {pastPredictions.map((prediction) => {
                        let purityDisplay;
                        if (prediction.metal === 'gold') {
                            purityDisplay = prediction.purity + 'K';
                        } else if (prediction.metal === 'silver') {
                            switch (prediction.purity) {
                                case '958':
                                    purityDisplay = '98.5% Pure Britannia';
                                    break;
                                case '925':
                                    purityDisplay = '92.5% Pure Sterling';
                                    break;
                                case '800':
                                    purityDisplay = '80% Pure Jewelry';
                                    break;
                                case '700':
                                    purityDisplay = '70% Pure Coin';
                                    break;
                                default:
                                    purityDisplay = '99.9% Pure';
                            }
                        } else if (prediction.metal === 'platinum') {
                            purityDisplay = 'PT' + prediction.purity;
                        } else {
                            purityDisplay = 'PD' + prediction.purity;
                        }

                        return (
                            <div key={prediction.id} className={styles.prediction} onClick={() => toggleIndex(prediction.id)}>
                                <div className={styles.summary}>
                                    <p>Price of <strong>{purityDisplay} {prediction.metal}</strong> in {prediction.currency} starting from {prediction.start_date} for 30 days</p>
                                    <div>
                                        <p>{expandedIndex === prediction.id ? '▲' : '▼'}</p>
                                        <img src={delete_icon} alt='delete' onClick={() => handleDelete(prediction.id)} />
                                    </div>
                                </div>
                                <div className={`${styles.details} ${expandedIndex === prediction.id ? styles.expanded : ''}`}>
                                    <div className={styles.chart_container}>
                                        <Line options={options} data={LineData(prediction.predictions)}/>
                                    </div>
                                </div>               
                            </div>
                    )})}
                    </div>
                    : <p style={{ color: 'darkred' }}>No past predictions found.</p>
                }
                <div className={styles.prediction_link_container}>
                    <NavLink to='/prediction' className={styles.prediction_link}>Make Prediction</NavLink>
                </div>
                </div>
            </div>
        </div>
    );
};

export default PastPredictions;