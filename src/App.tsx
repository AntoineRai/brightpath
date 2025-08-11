import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';

// Nouvelles pages
import CandidaturesSuivi from './pages/CandidaturesSuivi';
import CVGenerator from './pages/CVGenerator';
import LettresMotivation from './pages/LettresMotivation';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import MockIndicator from './components/MockIndicator';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Fonctionnalités principales */}
                <Route path="/candidatures" element={
                  <ProtectedRoute>
                    <CandidaturesSuivi />
                  </ProtectedRoute>
                } />
                <Route path="/cv-generator" element={
                  <ProtectedRoute>
                    <CVGenerator />
                  </ProtectedRoute>
                } />
                <Route path="/lettres-motivation" element={
                  <ProtectedRoute>
                    <LettresMotivation />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />

                {/* Pages légales */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Route 404 - Doit être en dernier */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
        <MockIndicator />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
