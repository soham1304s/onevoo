import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const TermsPage = () => {
    const [term, setTerm] = useState('5-year');
    const [signed, setSigned] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();

    const fiveYearTerms = [
        '5-year commitment to the Onevoo platform.',
        'Access to all standard templates and features.',
        '24/7 standard customer support.',
        'Quarterly performance reviews and reports.',
    ];

    const sevenYearTerms = [
        '7-year commitment to the Onevoo platform.',
        'Access to all premium and exclusive templates.',
        'Priority 24/7 customer support with a dedicated agent.',
        'Monthly in-depth performance reviews and strategic consultations.',
        'Early access to new features and beta programs.',
    ];

    const handleSign = () => {
        // In a real app, you'd handle form data and API calls here.
        setSigned(true);
        setShowNotification(true);
        // Optional: redirect after a delay
        setTimeout(() => {
            navigate('/'); // Redirect to home page
        }, 3500);
    };

    return (
        <>
            <Notification
                message="Contract Signed Successfully!"
                show={showNotification}
                onHide={() => setShowNotification(false)}
            />
            <div className="terms-page wrap">
                <h1>Terms & Conditions</h1>
                <div className="terms-content">
                    {!signed ? (
                        <>
                            <h2>Select Your Contract Term</h2>
                            <div className="term-toggle">
                                <button
                                    className={`term-btn ${term === '5-year' ? 'active' : ''}`}
                                    onClick={() => setTerm('5-year')}>
                                    5-Year Plan
                                </button>
                                <button
                                    className={`term-btn ${term === '7-year' ? 'active' : ''}`}
                                    onClick={() => setTerm('7-year')}>
                                    7-Year Plan
                                </button>
                            </div>

                            <div className="term-details">
                                <h3 className="term-label">{term} Contract Details</h3>
                                <ul className="term-points">
                                    {(term === '5-year' ? fiveYearTerms : sevenYearTerms).map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>

                            <p className="contract-note">
                                By clicking "Sign Contract", you agree to the terms and conditions outlined above for the selected period.
                            </p>

                            <div className="form-group">
                                <button className="btn btn-solid" onClick={handleSign}>
                                    Sign Contract
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="applied-success-state">
                            <div className="success-icon-wrap" style={{ borderColor: 'var(--c-green)' }}>
                                <span style={{ color: 'var(--c-green)' }}>✓</span>
                            </div>
                            <h3>Thank You!</h3>
                            <p className="form-success-sub">Your contract has been signed. You will be redirected shortly.</p>
                        </div>
                    )}
                </div>
                <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        </>
    );
};

export default TermsPage;