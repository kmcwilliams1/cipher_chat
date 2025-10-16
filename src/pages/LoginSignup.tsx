// File: src/pages/LoginSignup.tsx
import React, { useState } from 'react';
import { beginWebAuthnRegister, finishWebAuthnRegister, beginWebAuthnLogin, finishWebAuthnLogin } from '../services/auth';
import { putBlob, encryptBlob } from '../lib/storage';
import '../CSS/LoginSignup.css';


const SocialButton: React.FC<{ label: string; href?: string; children: React.ReactNode }> = ({ label, href = '#', children }) => (
    <a className="social-btn" href={href} aria-label={label} onClick={(e) => e.preventDefault()}>
        {children}
    </a>
)
const LoginSignup: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // used for local backup encryption only (not server plaintext)
    const [status, setStatus] = useState<string | null>(null);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        try {
            setStatus('starting WebAuthn register...');
            const options = await beginWebAuthnRegister(email);
            // convert base64 fields to ArrayBuffers as needed here (server should send suitable structure)
            // navigator.credentials.create expects ArrayBuffers in specific places
            // For a minimal demo, assume server returns a ready-to-use PublicKeyCredentialCreationOptions
            const cred = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential;
            await finishWebAuthnRegister(cred);
            // create local key bundle (placeholder): store encrypted empty bundle with password
            const bundle = new Uint8Array([1, 2, 3]); // replace with real key export
            const encrypted = await encryptBlob(password || 'temporary-pass', bundle);
            await putBlob('keybundle:' + email, encrypted);
            setStatus('registered and saved bundle locally');
        } catch (err: any) {
            setStatus('register error: ' + (err.message || String(err)));
        }
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            setStatus('starting WebAuthn login...');
            const options = await beginWebAuthnLogin(email);
            const cred = (await navigator.credentials.get({ publicKey: options })) as PublicKeyCredential;
            await finishWebAuthnLogin(cred);
            setStatus('login successful');
            // fetch encrypted keybundle and decrypt in next step (not shown)
        } catch (err: any) {
            setStatus('login error: ' + (err.message || String(err)));
        }
    }

    return (
        <div className={`home-container ${isRegister ? 'bg-image' : ''}`} style={isRegister ? { backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" } : {}}>
            {isRegister && <div className="mask gradient-custom-3" />}
            <form
                className={`auth-card ${isRegister ? 'register' : ''}`}
                onSubmit={(e) => e.preventDefault()}
            >
                {isRegister ? (
                    <>
                        <h2 className="auth-title">Create an account</h2>

                        <label className="field">
                            <span className="field-label">Your Name</span>
                            <input className="input" type="text" id="name" placeholder="Your name" required />
                        </label>

                        <label className="field">
                            <span className="field-label">Your Email</span>
                            <input className="input" type="email" id="emailReg" placeholder="you@example.com" required />
                        </label>

                        <label className="field">
                            <span className="field-label">Password</span>
                            <input className="input" type="password" id="passwordReg" placeholder="••••••••" required />
                        </label>

                        <label className="field">
                            <span className="field-label">Repeat your password</span>
                            <input className="input" type="password" id="passwordRepeat" placeholder="••••••••" required />
                        </label>

                        <div className="row between small-gap center-justify">
                            <label className="checkbox">
                                <input type="checkbox" id="agree" />
                                <span>I agree all statements in Terms of service</span>
                            </label>
                        </div>

                        <button className="btn primary gradient-custom-4" type="submit">Register</button>

                        <div className="text-center">
                            <p className="muted">Already a member? <a className="link" href="#!" onClick={(e) => { e.preventDefault(); setIsRegister(false); }}>Sign in</a></p>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="auth-title">Sign in</h2>

                        <label className="field">
                            <span className="field-label">Email address</span>
                            <input className="input" type="email" id="email" placeholder="you@example.com" required />
                        </label>

                        <label className="field">
                            <span className="field-label">Password</span>
                            <input className="input" type="password" id="password" placeholder="••••••••" required />
                        </label>

                        <div className="row between small-gap">
                            <label className="checkbox">
                                <input type="checkbox" id="remember" />
                                <span>Remember me</span>
                            </label>
                            <a className="link" href="#!" onClick={(e) => { e.preventDefault(); setIsRegister(true); }}>Forgot password?</a>
                        </div>

                        <button className="btn primary" type="submit">Sign in</button>

                        <div className="text-center">
                            <p className="muted">Not a member? <a className="link" href="#!" onClick={(e) => { e.preventDefault(); setIsRegister(true); }}>Register</a></p>
                            <p className="muted">or sign up with:</p>

                            <div className="social-row" aria-hidden={false}>
                                <SocialButton label="Sign in with Facebook" href="#!">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.244 0-1.63.772-1.63 1.562v1.875h2.773l-.444 2.89h-2.329v6.99C18.343 21.128 22 16.99 22 12z"/></svg>
                                </SocialButton>

                                <SocialButton label="Sign in with Twitter" href="#!">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.924c-.66.293-1.37.49-2.116.579a3.7 3.7 0 0 0 1.623-2.034 7.28 7.28 0 0 1-2.337.893 3.64 3.64 0 0 0-6.204 3.319A10.33 10.33 0 0 1 3.16 4.89a3.63 3.63 0 0 0 1.126 4.849 3.58 3.58 0 0 1-1.65-.456v.046a3.64 3.64 0 0 0 2.92 3.567 3.7 3.7 0 0 1-1.643.062 3.65 3.65 0 0 0 3.403 2.52A7.295 7.295 0 0 1 2 19.54a10.28 10.28 0 0 0 5.57 1.633c6.683 0 10.337-5.536 10.337-10.337 0-.157-.004-.313-.011-.469A7.397 7.397 0 0 0 22 5.924z"/></svg>
                                </SocialButton>

                                <SocialButton label="Sign in with Google" href="#!">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.805 10.023h-9.79v3.954h5.605c-.242 1.515-1.02 2.8-2.18 3.656v3.035h3.52C20.7 19.26 22 15.95 22 12c0-.681-.06-1.345-.195-1.977z"/><path d="M12.015 22c2.7 0 4.97-.894 6.627-2.427l-3.52-3.035c-.98.657-2.23 1.05-3.107 1.05-2.39 0-4.42-1.613-5.144-3.787H3.18v3.254C4.82 19.884 8.15 22 12.015 22z"/><path d="M6.87 13.81a5.99 5.99 0 0 1 0-3.62V6.936H3.18a9.99 9.99 0 0 0 0 10.128l3.69-3.251z"/><path d="M12.015 6.08c1.468 0 2.792.505 3.836 1.5l2.873-2.874C16.986 2.97 14.706 2 12.015 2 8.15 2 4.82 4.116 3.18 7.246l3.69 3.254C7.596 7.693 9.624 6.08 12.015 6.08z"/></svg>
                                </SocialButton>

                                <SocialButton label="Sign in with GitHub" href="#!">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.28 3.438 9.75 8.205 11.325.6.113.82-.262.82-.582 0-.288-.01-1.05-.016-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.3 1.23a11.48 11.48 0 0 1 3.003-.403c1.018.004 2.044.137 3.003.403 2.29-1.553 3.297-1.23 3.297-1.23.653 1.652.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.48 5.92.431.371.815 1.103.815 2.222 0 1.605-.015 2.898-.015 3.293 0 .322.216.698.825.58C20.565 22.245 24 17.78 24 12.5 24 5.87 18.63.5 12 .5z"/></svg>
                                </SocialButton>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default LoginSignup;