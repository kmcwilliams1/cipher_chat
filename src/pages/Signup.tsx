import React, {useState} from 'react';
import {beginWebAuthnRegister, finishWebAuthnRegister, base64ToArrayBuffer} from '../services/auth';
import {putBlob, encryptBlob} from '../lib/storage';
import '../CSS/Signup.css';
import {Link} from "react-router";


const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // used for local backup encryption only
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [agree, setAgree] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

// inside component
    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (!email || !password) {
                setStatus('enter email and backup password');
                return;
            }
            setStatus('starting WebAuthn registration...');
            // fetch server options
            const options = (await beginWebAuthnRegister(email)) as PublicKeyCredentialCreationOptions;

            console.log('server options (raw):', options);

            const normalizePublicKeyOptions = (opts: any) => {
                const o = { ...opts };

                // ensure challenge is ArrayBuffer
                if (o.challenge && !(o.challenge instanceof ArrayBuffer)) {
                    try { o.challenge = base64ToArrayBuffer(String(o.challenge)); }
                    catch (e) { console.warn('failed to convert challenge to ArrayBuffer', e); }
                }

                // ensure user.id is ArrayBuffer
                if (o.user && o.user.id && !(o.user.id instanceof ArrayBuffer)) {
                    try { o.user = { ...o.user, id: base64ToArrayBuffer(String(o.user.id)) }; }
                    catch (e) { console.warn('failed to convert user.id to ArrayBuffer', e); }
                }

                // allowCredentials ids
                if (Array.isArray(o.allowCredentials)) {
                    o.allowCredentials = o.allowCredentials.map((c: any) => {
                        if (c && typeof c.id === 'string') {
                            try { return { ...c, id: base64ToArrayBuffer(c.id) }; }
                            catch (e) { console.warn('failed to convert allowCredentials id', e); return c; }
                        }
                        return c;
                    });
                }

                return o;
            };

            const normalizedOptions = normalizePublicKeyOptions(options);
            console.log('normalizedOptions checks:',
                'challenge instanceof ArrayBuffer=', normalizedOptions.challenge instanceof ArrayBuffer,
                'user.id instanceof ArrayBuffer=', normalizedOptions.user?.id instanceof ArrayBuffer,
                'allowCredentials count=', Array.isArray(normalizedOptions.allowCredentials) ? normalizedOptions.allowCredentials.length : 0
            );

            // call browser WebAuthn from user gesture
            const credential = (await navigator.credentials.create({ publicKey: normalizedOptions })) as PublicKeyCredential | null;
            if (!credential) throw new Error('no credential created');

            setStatus('sending attestation to server...');
            const result = await finishWebAuthnRegister(credential);
            if (!result || !result.ok) throw new Error(result?.error || 'register complete failed');

            setStatus('registration successful');
        } catch (err: any) {
            setStatus('register error: ' + (err?.message || String(err)));
        }
    }

    return (
        <div className="home-container bg-image"
             style={{backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')"}}>
            <div className="mask gradient-custom-3"/>
            <form className="auth-card register" onSubmit={handleRegister}>
                <h2 className="auth-title">Create an account</h2>

                <label className="field">
                    <span className="field-label">Your Name</span>
                    <input className="input" type="text" id="name" placeholder="Your name" required value={name}
                           onChange={(e) => setName(e.target.value)}/>
                </label>

                <label className="field">
                    <span className="field-label">Your Email</span>
                    <input className="input" type="email" id="emailReg" placeholder="you@example.com" required
                           value={email} onChange={(e) => setEmail(e.target.value)}/>
                </label>

                <label className="field">
                    <span className="field-label">Password</span>
                    <input className="input" type="password" id="passwordReg" placeholder="••••••••" required
                           value={password} onChange={(e) => setPassword(e.target.value)}/>
                </label>

                <label className="field">
                    <span className="field-label">Repeat your password</span>
                    <input className="input" type="password" id="passwordRepeat" placeholder="••••••••" required
                           value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)}/>
                </label>

                <div className="row between small-gap center-justify">
                    <label className="checkbox">
                        <input type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)}/>
                        <span>I agree all statements in Terms of service</span>
                    </label>
                </div>

                <button className="btn primary gradient-custom-4" type="submit">Register</button>
                <p className="muted text-center">Already a member? <Link className="link" to="/login">Login</Link></p>

                {status && <p className="muted">{status}</p>}
            </form>
        </div>
    );
};

export default Signup;