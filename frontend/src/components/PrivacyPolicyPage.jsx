import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="terms-page wrap">
            <h1>Privacy Policy</h1>
            <p className="form-success-sub" style={{ textAlign: 'center', marginBottom: '48px' }}>
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="terms-content" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                <h2>1. Introduction</h2>
                <p>
                    Welcome to Onevoo ("Company", "we", "our", "us")! We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@onevoo.com.
                </p>

                <h2>2. Information We Collect</h2>
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform or otherwise when you contact us.
                </p>
                <p>
                    The personal information that we collect depends on the context of your interactions with us and the platform, the choices you make and the products and features you use. The personal information we collect may include the following: name, email address, social media handles, portfolio links, and payment information.
                </p>

                <h2>3. How We Use Your Information</h2>
                <p>
                    We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </p>
                <ul className="term-points">
                    <li>To facilitate account creation and logon process.</li>
                    <li>To manage user accounts.</li>
                    <li>To send administrative information to you.</li>
                    <li>To protect our Services.</li>
                    <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
                </ul>

                <h2>4. Will Your Information Be Shared With Anyone?</h2>
                <p>
                    We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work.
                </p>

                <h2>5. Data Security</h2>
                <p>
                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                </p>

                <h2>6. Your Privacy Rights</h2>
                <p>
                    In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
                </p>

                <h2>7. Changes to This Policy</h2>
                <p>
                    We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                    If you have questions or comments about this policy, you may email us at privacy@onevoo.com.
                </p>
            </div>
            <br />
            <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginTop: '24px' }}>
                Go Back
            </button>
        </div>
    );
};

export default React.memo(PrivacyPolicyPage);