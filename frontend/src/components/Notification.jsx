import React, { useState, useEffect } from 'react';

const Notification = ({ message, show, onHide }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show);
        if (show) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onHide) {
                    onHide();
                }
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    if (!message) return null;

    return (
        <div className={`notification ${visible ? 'show' : 'hide'}`}>{message}</div>
    );
};

export default Notification;