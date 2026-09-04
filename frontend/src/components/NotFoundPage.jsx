import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="not-found-page wrap">
            <div className="not-found-content">
                <div style={{ fontSize: '6rem', marginBottom: '24px' }}>
                    <span>🤷‍♂️</span>
                </div>
                <h1>404 - Page Not Found</h1>
                <p className="form-success-sub">
                    Oops! The page you are looking for does not exist. It might have been moved or deleted.
                </p>
                <br />
                <Link to="/" className="btn btn-solid">
                    Go Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;