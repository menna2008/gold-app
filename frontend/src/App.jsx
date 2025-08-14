import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Prediction from "./components/Prediction.jsx";

function App() {
  return (
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/prediction' element={<Prediction />} />
          <Route path='/past_predictions' element={<PastPredictions />} />
      </Routes>
  )
}

export default App;
