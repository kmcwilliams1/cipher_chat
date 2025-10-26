import React, { useState } from 'react';
import { beginWebAuthnRegister, finishWebAuthnRegister } from '../services/auth';
import { putBlob, encryptBlob } from '../lib/storage';
import '../CSS/Signup.css';
import {Link} from "react-router";

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // used for local backup encryption only
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [agree, setAgree] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        if (!agree) {
            setStatus('You must agree to the Terms of service.');
            return;
        }
        if (password !== passwordRepeat) {
            setStatus('Passwords do not match.');
            return;
        }
        try {
            setStatus('starting WebAuthn register...');
            const options = await beginWebAuthnRegister(email);
            const cred = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential;
            await finishWebAuthnRegister(cred);
            // placeholder local key bundle (replace with real export)
            const bundle = new Uint8Array([1, 2, 3]);
            const encrypted = await encryptBlob(password || 'temporary-pass', bundle);
            await putBlob('keybundle:' + email, encrypted);
            setStatus('registered and saved bundle locally');
        } catch (err: any) {
            setStatus('register error: ' + (err?.message || String(err)));
        }
    }

    return (
        <div className="home-container bg-image" style={{ backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" }}>
            <div className="mask gradient-custom-3" />
            <form className="auth-card register" onSubmit={handleRegister}>
                <h2 className="auth-title">Create an account</h2>

                <label className="field">
                    <span className="field-label">Your Name</span>
                    <input className="input" type="text" id="name" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
                </label>

                <label className="field">
                    <span className="field-label">Your Email</span>
                    <input className="input" type="email" id="emailReg" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label className="field">
                    <span className="field-label">Password</span>
                    <input className="input" type="password" id="passwordReg" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>

                <label className="field">
                    <span className="field-label">Repeat your password</span>
                    <input className="input" type="password" id="passwordRepeat" placeholder="••••••••" required value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} />
                </label>

                <div className="row between small-gap center-justify">
                    <label className="checkbox">
                        <input type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                        <span>I agree all statements in Terms of service</span>
                    </label>
                </div>

                <button className="btn primary gradient-custom-4" type="submit">Register</button>
                <p className="muted text-center" >Already a member? <Link className="link" to="/login">Login</Link></p>

                {status && <p className="muted">{status}</p>}
            </form>
        </div>
    );
};

export default Signup;