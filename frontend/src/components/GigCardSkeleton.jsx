import React from 'react';

const GigCardSkeleton = () => {
    return (
        <div className="gig-card-skeleton">
            <div className="skeleton-line" style={{ width: '40%', height: '16px' }} />
            <div className="skeleton-line" style={{ width: '25%', height: '12px', position: 'absolute', top: '24px', right: '24px' }} />
            <div className="skeleton-box" />
            <div className="skeleton-line" style={{ width: '70%', height: '24px', marginTop: 'auto' }} />
            <div className="skeleton-line" style={{ width: '50%', height: '16px', marginTop: '8px' }} />
        </div>
    );
};

export default GigCardSkeleton;