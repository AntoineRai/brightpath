import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

// Nouvelles pages
import CandidaturesSuivi from './pages/CandidaturesSuivi';
import CVGenerator from './pages/CVGenerator';
import LettresMotivation from './pages/LettresMotivation';
import Login from './pages/Login';

// Components
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Nouvelles routes */}
            <Route path="/candidatures" element={<CandidaturesSuivi />} />
            <Route path="/cv-generator" element={<CVGenerator />} />
            <Route path="/lettres-motivation" element={<LettresMotivation />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
