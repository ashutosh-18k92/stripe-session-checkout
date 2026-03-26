import React from 'react';

export default function About() {
    return (
        <div className="about-container">
            <header className="about-header">
                <h1>About Us</h1>
            </header>

            <section className="about-content">
                <div className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        We are dedicated to providing the best payment solutions for modern businesses.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Who We Are</h2>
                    <p>
                        Our team consists of experienced professionals passionate about simplifying payments and helping businesses grow.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Why Choose Us</h2>
                    <ul>
                        <li>Secure and reliable payment processing</li>
                        <li>Fast integration with Stripe</li>
                        <li>24/7 customer support</li>
                        <li>Competitive pricing</li>
                    </ul>
                </div>
            </section>

            <footer className="about-footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
}

