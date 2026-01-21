import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HackathonPage from './components/HackathonPage';
import RegistrationForm from './components/RegistrationForm';

/**
 * Root Application Component.
 * Handles primary routing and global layouts.
 */
export default function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HackathonPage />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}
