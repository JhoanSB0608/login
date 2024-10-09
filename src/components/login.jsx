import React, { useState } from 'react';
import '../css/login.css';
import star from '../storage/img/Star.svg';
import facebook from '../storage/img/Facebook.svg'
import google from '../storage/img/Google.svg'
import applestore from '../storage/img/Apple.svg'

const Login = () => {
    const [email, setEmail] = useState('helloworld@gmail.com');
    const [password, setPassword] = useState('123456789');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        // Manejar la respuesta aquí
        console.log(await response.json());
    };

    return (
        <main>
            <header>
                <div className="header__logo">
                    <img src={star} alt="Logo" />
                </div>
            </header>
            <section className="section__form">
                <h1>Log in</h1>
                <form onSubmit={handleSubmit} className="login">
                    <label htmlFor="email">Email address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <span>Forgot password?</span>
                    <input type="submit" value="Log in" />
                </form>
            </section>
            <section>
                <div className="section__line">
                    <span>Or Login with</span>
                </div>
                <div className="section__social">
                    <a href="/login"><img src={facebook} alt="Facebook" /></a>
                    <a href="http://localhost:3000/auth/google"><img src={google} alt="Google" /></a>
                    <a href="/login"><img src={applestore} alt="Apple" /></a>
                </div>
            </section>
            <footer>
                <p>Don’t have an account? <b>Sign up</b></p>
            </footer>
        </main>
    );
};

export default Login;