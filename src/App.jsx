import Dashboard from './Dashboard';
import Navbar from './Navbar';
import NotFound from './NotFound';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="routes">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            {/* <Route path="/login" element={<LoginForm />} /> */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
