import React from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';
import illustration from '../storage/img/Illustration.svg';

const Home = () => {
    return (
        <main>
            <section className="section__imagen">
                <div className="section__container">
                    <img src={illustration} alt="Illustration" />
                </div>
                <div className="section__text">
                    <h1>Explore the app</h1>
                    <small>Now your finances are in one place and always under control</small>
                </div>
            </section>
            <section className="section__button">
                <Link to="/login">Sign In</Link>
                <Link to="/create-account">Create account</Link>
            </section>
        </main>
    );
};

export default Home;