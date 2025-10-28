import {useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import '../CSS/LandingPage.css';



const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className={`home-container ${showRegister ? 'bg-image' : ''}`}
             style={showRegister ? {backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')"} : {}}>
            {showRegister && <div className="mask gradient-custom-3"/>}
            <div className="home-content">
                <h1>Welcome to Cipher Chat</h1>
                <p>Your secure and private messaging platform.</p>
                <div className="button-group">
                    <button className="btn primary" onClick={() => navigate('/signup')}>Get Started</button>
                    <button className="btn secondary" onClick={() => navigate('/login')}>Already Have an Account?</button>
                    <button className="btn outline"
                            onClick={() => alert('About Cipher Chat: Our mission is to provide a secure and private messaging experience for everyone.')}>About
                        Us
                    </button>
                </div>
            </div>
        </div>
    );


}

export default LandingPage;
