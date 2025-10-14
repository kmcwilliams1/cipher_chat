import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginSignupPage from './pages/LoginSignup';
import ProfilePage from './pages/Profile';



const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loginsignup" element={<LoginSignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
};

export default AppRoutes;
