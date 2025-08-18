import Header from "./Header.jsx";
import styles from "./Prediction.module.css"
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
)

const options = {
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Price Predictions over the next 30 days',
            color: 'black',
            font: {
                family: "'Comic Sans MS', cursive, sans-serif",
                size: 16,
                weight: 'bold',
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Date',
                color: 'black',
                font: {
                    family: "'Comic Sans MS', cursive, sans-serif",
                    size: 14,
                    weight: 'bold',
                }
            },
            ticks: {
                color: 'black',
                font: {
                    family: "'Comic Sans MS', cursive, sans-serif",
                    size: 12,
                }
            },
            grid: {
                color: 'rgb(0, 0, 0, 0.2)',
            }
        },
        y: {
            title: {
                display: true,
                text: 'Price ($)',
                color: 'black',
                font: {
                    family: "'Comic Sans MS', cursive, sans-serif",
                    size: 14,
                    weight: 'bold',
                }
            },
            ticks: {
                color: 'black',
                font: {
                    family: "'Comic Sans MS', cursive, sans-serif",
                    size: 12,
                }
            },
            grid: {
                color: 'rgb(0, 0, 0, 0.2)',
            }
        }
    }
}

const LineData = (predictions) => {
    let dates = []
    let prices = []

    predictions.forEach((element) => {
        dates.push(element['date'])
        prices.push(element['price'])
    })

    return {
        labels: dates,
        datasets: [{
            data: prices,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(176, 196, 222)"
        }]
    }
}

const Loading = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
        }, 750);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className={styles.loading}>
            Loading{dots}
        </div>
    )
}

const Prediction = () => {

    const [metal, setMetal] = useState('');
    const [purity, setPurity] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');
    const [predictions, setPredictions] = useState([]);

    const submit = async () => {
        if (metal === '') {
            alert('Please enter a metal');
            return;
        }
        if (purity === '') {
            alert('Please enter a purity');
            return;
        }
        try {
            setPredictions([]);
            setLoading(true);

            const url = `http://127.0.0.1:8000/djangoapp/prediction?metal=${metal}&purity=${purity}&currency=${currency}`;
            let res = await fetch(url, {
                method : 'GET',
            });
            const status = res.status
            res = await res.json();

            if (status === 200) {
                setPredictions(res['predictions']);
            } else {
                alert('Error fetching predictions')
            }
        } catch (error) {
            alert('Network error')
        } finally {
            setLoading(false);
        }
    }

    const reset = () => {
        setMetal('');
        setPurity('');
        setCurrency('USD');
        setPredictions([]);
    }

    const savePrediction = async () => {
        if (predictions.length === 0) {
            alert('Please generate predictions before saving');
        } else {
            let res = await fetch('http://127.0.0.1:8000/djangoapp/save_prediction', {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'metal': metal,
                    'purity': purity,
                    'currency': currency,
                    'predictions': predictions
                })
            });

            res = await res.json();

            if (res.status === 'success') {
                alert('Prediction saved successfully');
            } else {
                alert(res.message);
            }
        }
    }

    let purity_options

    if (metal === '') {
        purity_options = <select name="purity" id="purity" defaultValue="">
            <option disabled value="">Select a metal first</option>
        </select>
    } else if (metal === 'gold') {
        purity_options = <select name="purity" id="purity" value={purity} onChange={(e) => setPurity(e.target.value)}>
            <option disabled value="">Select Option</option>
            <option value="18">18k Gold</option>
            <option value="22">22k Gold</option>
            <option value="24">24k Gold</option>
        </select>
    } else if (metal === 'silver') {
        purity_options = <select name="purity" id="purity" value={purity} onChange={(e) => setPurity(e.target.value)}>
            <option disabled value="">Select Option</option>
            <option value="99.9">Pure Silver (99.9% Purity)</option>
            <option value="95.8">Britannia (95.8% Purity)</option>
            <option value="92.5">Sterling Silver (92.5% Purity)</option>
            <option value="80">Jewelry Silver (80% Purity)</option>
            <option value="70">Coin Silver (70% Purity)</option>
        </select>
    } else if (metal === 'platinum') {
        purity_options = <select name="purity" id="purity" value={purity} onChange={(e) => setPurity(e.target.value)}>
            <option disabled value="">Select Option</option>
            <option value="1000">Pt1000 (Nearly 100% Pure Platinum)</option>
            <option value="950">Pt950 (95% Pure Platinum)</option>
            <option value="900">Pt900 (90% Pure Platinum)</option>
            <option value="850">Pt850 (85% Pure Platinum)</option>
        </select>
    } else {
        purity_options = <select name="purity" id="purity" value={purity} onChange={(e) => setPurity(e.target.value)}>
            <option disabled value="">Select Option</option>
            <option value="999">Pd999 (99% Pure Palladium)</option>
            <option value="950">Pd950 (95% Pure Palladium)</option>
            <option value="500">Pd500 (50% Pure Palladium)</option>
        </select>
    }

    return (
        <div className={styles.body}>
            <Header />
            <div className={styles.prediction}>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <span>Metal</span>
                        <select name="metal" id="metal" value={metal} onChange={(e) => {
                            setMetal(e.target.value);
                            setPurity('');
                        }}>
                            <option disabled value="">Select Option</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="platinum">Platinum</option>
                            <option value="palladium">Palladium</option>
                        </select>
                    </div>
                    <div className={styles.option}>
                        <span>Purity</span>
                        {purity_options}
                    </div>
                    <div className={styles.option}>
                        <span>Currency</span>
                        <select name="currency" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option disabled value="">Select Currency</option>
                            <option value="USD">United States Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="GBP">British Pound Sterling (GBP)</option>
                            <option value="CHF">Swiss Franc (CHF)</option>
                            <option value="AED">UAE Dirham (AED)</option>
                            <option value="SAR">Saudi Riyal (SAR)</option>
                            <option value="INR">Indian Rupee (INR)</option>
                            <option value="JPY">Japanese Yen (JPY)</option>
                            <option value="CNY">Chinese Yuan (CNY)</option>
                            <option value="TRY">Turkish Lira (TRY)</option>
                            <option value="CAD">Canadian Dollar (CAD)</option>
                            <option value="AUD">Australian Dollar (AUD)</option>
                        </select>
                    </div>
                    <button onClick={submit}>Submit</button>
                    <button onClick={reset}>Reset</button>
                    {sessionStorage.getItem('username') ? <button onClick={savePrediction}>Save Prediction</button> : <></>}
                </div>
                <div className={styles.results}>
                    {loading && <Loading />}
                    {predictions.length > 0 &&  
                        <Line options={{ ...options, maintainAspectRatio: false }} data={LineData(predictions)} />
                    }
                </div>
            </div>
        </div>
    );
};

export default Prediction;
export { options, LineData };
