import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="container py-5">
            <div className="card border-0 shadow-lg p-5 rounded-5">
                <h1 className="mb-4 text-center fw-bold">Privacy Policy</h1>
                <p className="text-muted mb-2"><strong>Effective Date:</strong> January 1, 2025</p>

                <p>
                    At <strong>[Your Company Name]</strong>, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>

                <div className="mt-4">
                    <h5 className="fw-semibold">1. Information We Collect</h5>
                    <p>We may collect personal information that you provide directly to us, such as your name, email address, and phone number. We may also collect non-personal information like browser type, IP address, and usage data.</p>

                    <h5 className="fw-semibold">2. How We Use Your Information</h5>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide and maintain our services</li>
                        <li>Improve user experience</li>
                        <li>Send periodic emails and notifications</li>
                        <li>Monitor and analyze usage patterns</li>
                    </ul>

                    <h5 className="fw-semibold">3. Sharing Your Information</h5>
                    <p>We do not sell or rent your personal data. We may share your information with trusted third-party service providers who help us operate our website and conduct our business.</p>

                    <h5 className="fw-semibold">4. Data Security</h5>
                    <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

                    <h5 className="fw-semibold">5. Cookies and Tracking Technologies</h5>
                    <p>We may use cookies to enhance your experience on our site. You can choose to disable cookies through your browser settings.</p>

                    <h5 className="fw-semibold">6. Third-Party Links</h5>
                    <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or the content of those websites.</p>

                    <h5 className="fw-semibold">7. Your Choices</h5>
                    <p>You may opt-out of receiving promotional emails from us by following the unsubscribe link in those messages. You may also request access to or deletion of your personal information.</p>

                    <h5 className="fw-semibold">8. Children’s Privacy</h5>
                    <p>Our services are not intended for children under the age of 13, and we do not knowingly collect personal information from children.</p>

                    <h5 className="fw-semibold">9. Changes to This Privacy Policy</h5>
                    <p>We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date.</p>

                    <h5 className="fw-semibold">10. Contact Us</h5>
                    <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                    <ul className="list-unstyled">
                        <li><strong>Email:</strong> privacy@yourcompany.com</li>
                        <li><strong>Phone:</strong> +1 (123) 456-7890</li>
                        <li><strong>Address:</strong> 123 Dummy Street, City, Country</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
