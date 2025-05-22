



require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (email, otp) => {
    const msg = {
        to: email,
        from: 'help@ezkash.com', // must be a verified sender
        subject: 'Your code for ezkash Registration',
        html: `
        <p>Hi,</p>
        <p>Thank you for registering with <strong>ezkash</strong>.</p>
        <p>To complete your sign-up process, please use the code below:</p>
        <h2>🔐 Your code is: ${otp}</h2>
        <p><em>(This code is valid for the next 10 minutes)</em></p>
        <p>If you did not request this code, please ignore this email or contact our support team.</p>
        <p>Need help? Reach us at <a href="mailto:help@ezkash.com">help@ezkash.com</a></p>
        <br />
        <p>Thank you,<br />
        Team EZKash<br />
        <a href="https://www.ezkash.com">www.ezkash.com</a><br />
        <small>Ezkash - Check Cashing Simplified</small></p>
    `
    };
    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('SendGrid Error:', error.response?.body || error.message);
    }
};

const resendOtpMail = async (email, otp) => {
    const msg = {
        to: email,
        from: 'help@ezkash.com', // must be a verified sender
        subject: 'Your new code for EZKash verification',
        html: `
        <p>Hi,</p>
        <p>It looks like you requested a new code to complete your <strong>EZKash</strong> registration.</p>
        <p>Please use the verification code below:</p>
        <h2>🔁 Your new code is: ${otp}</h2>
        <p><em>(This code is valid for the next 10 minutes)</em></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>Need help? Reach us at <a href="mailto:help@ezkash.com">help@ezkash.com</a></p>
        <br />
        <p>Thank you,<br />
        Team EZKash<br />
        <a href="https://www.ezkash.com">www.ezkash.com</a><br />
        <small>Ezkash - Check Cashing Simplified</small></p>
        `
    };
    try {
        await sgMail.send(msg);
        console.log(`Resent OTP email to ${email}`);
    } catch (error) {
        console.error('SendGrid Error:', error.response?.body || error.message);
    }
};


const forgotPasswordMail = async (email, otp) => {
    const msg = {
        to: email,
        from: 'help@ezkash.com', // must be a verified sender
        subject: 'Reset your EZKash password',
        html: `
        <p>Hi,</p>
        <p>We received a request to reset your <strong>EZKash</strong> account password.</p>
        <p>Please use the code below to reset your password:</p>
        <h2>🔐 Password Reset Code: ${otp}</h2>
        <p><em>(This code is valid for the next 10 minutes)</em></p>
        <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
        <p>Need help? Reach us at <a href="mailto:help@ezkash.com">help@ezkash.com</a></p>
        <br />
        <p>Thank you,<br />
        Team EZKash<br />
        <a href="https://www.ezkash.com">www.ezkash.com</a><br />
        <small>Ezkash - Check Cashing Simplified</small></p>
        `
    };
    try {
        await sgMail.send(msg);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('SendGrid Error:', error.response?.body || error.message);
    }
};



module.exports = { sendMail, resendOtpMail, forgotPasswordMail };
