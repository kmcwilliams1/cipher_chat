import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            background: '#075E54',
            color: '#fff'
        }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                Cipher_Chat
            </button>
            <button
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    padding: 0,
                    border: 'none',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'none'
                }}
                onClick={() => navigate('/profile')}
            >
                <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="Profile"
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        objectFit: 'cover'
                    }}
                />
            </button>
        </header>
    );
};

export default Header;
