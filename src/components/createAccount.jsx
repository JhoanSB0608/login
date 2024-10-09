import React, { useState } from 'react';
import axios from 'axios';
import '../css/createAccount.css';
import star from '../storage/img/Star.svg';

const CreateAccount = () => {
    const [nick, setNick] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('123456789');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/register', {
                nick,
                email,
                password,
            });
            // Manejar la respuesta aquí
            console.log(response.data);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    return (
        <main>
            <header>
                <div className="header__logo">
                    <img src={star} alt="Logo" />
                </div>
            </header>
            <section className="section__form">
                <h1>Create account</h1>
                <form onSubmit={handleSubmit} className="login" id="myForm">
                    <label htmlFor="nick">Username</label>
                    <input type="text" name="nick" placeholder="Your username" required value={nick} onChange={(e) => setNick(e.target.value)} />
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span>I accept the terms and privacy policy</span>
                    <input type="submit" value="Log in" />
                </form>
            </section>
            <footer>
                <p>Don’t have an account? <b>Sign up</b></p>
            </footer>
        </main>
    );
};

export default CreateAccount;