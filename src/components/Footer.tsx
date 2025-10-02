import React from 'react';

const Footer: React.FC = () => (
    <footer style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        padding: '16px',
        background: '#ece5dd',
        borderTop: '1px solid #ddd',
        fontSize: '14px',
        zIndex: 100
    }}>
        <a
            href="https://github.com/kmcwilliams1/cipher_chat"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#075E54', textDecoration: 'none', marginRight: '8px' }}
        >
            GitHub Repository
        </a>
        | Developed by KCCA Security
    </footer>
);

export default Footer;
