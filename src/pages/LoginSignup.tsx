import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';


const LoginSignup: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const navigate = useNavigate();

    return (
        <div>
            <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
            <div>
                <label>
                    <input
                        type="radio"
                        value="login"
                        checked={mode === 'login'}
                        onChange={() => setMode('login')}
                    />
                    Login
                </label>
                <label style={{marginLeft: '1em'}}>
                    <input
                        type="radio"
                        value="signup"
                        checked={mode === 'signup'}
                        onChange={() => setMode('signup')}
                    />
                    Sign Up
                </label>
            </div>
            {mode === 'login' ? (
                <form>
                    <div>
                        <label>
                            Email:
                            <input type="email" required/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input type="password" required/>
                        </label>
                    </div>
                    <button type="submit">Login</button>
                </form>
            ) : (
                <form>
                    <div>
                        <label>
                            Email:
                            <input type="email" required/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input type="password" required/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Confirm Password:
                            <input type="password" required/>
                        </label>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            )}


            <div>
                <button onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>

        </div>


    );
};

export default LoginSignup;
