import React from 'react';
import { useNavigate } from 'react-router-dom';



const HomePage: React.FC = () => {


    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to Cipher Chat</h1>
            <p>This is the home page.</p>

            <button onClick={() => navigate('/loginsignup')}>
                Go to Login/Signup
            </button>

        </div>
    );
};

export default HomePage;
