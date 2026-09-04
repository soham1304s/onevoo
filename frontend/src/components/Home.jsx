import React from 'react';
import Hero from './Hero';
import CreativeOSPreview from './CreativeOSPreview';
import Offerings from './Offerings';
import BeforeAfter from './BeforeAfter';
import CreatorStories from './CreatorStories';
import BrandTrustCloud from './BrandTrustCloud';
import ContractTerms from './ContractTerms';
import CreatorPayoutsDashboard from './CreatorPayoutsDashboard';
import ComingSoon from './ComingSoon';

const Home = () => {
    return (
        <>
            <Hero />
            <CreativeOSPreview />
            <Offerings />
            <BeforeAfter />
            <CreatorStories />
            <BrandTrustCloud />
            <ContractTerms />
            <CreatorPayoutsDashboard />
            <ComingSoon />
        </>
    );
};

export default Home;