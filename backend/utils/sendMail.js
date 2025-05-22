


// // const nodemailer = require("nodemailer");

// // const sendMail = async (email, otp) => {
// //     const transporter = nodemailer.createTransport({
// //         host: process.env.SMPT_HOST,
// //         port: process.env.SMPT_PORT,
// //         service: process.env.SMPT_SERVICE,
// //         auth: {
// //             user: process.env.SMPT_MAIL,
// //             pass: process.env.SMPT_PASSWORD,
// //         },
// //     });

// //     await transporter.sendMail({
// //         from: '"Check App" <pinkspot.ap@gmail.com>',
// //         to: email,
// //         subject: 'OTP for Registration',
// //         html: `<h3>Your OTP is: ${otp}</h3>`,
// //     });



// // };

// // module.exports = sendMail;


// const nodemailer = require("nodemailer");

// const sendMail = async (email, otp) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMPT_HOST,
//         port: Number(process.env.SMPT_PORT),
//         secure: false, // true if using 465, false for other ports
//         auth: {
//             user: process.env.SMPT_MAIL,
//             pass: process.env.SMPT_PASSWORD,
//         },
//         tls: {
//             rejectUnauthorized: false, // might help in some cases
//         },
//         logger: true,
//         debug: true,
//     });

//     try {
//         await transporter.sendMail({
//             from: `"Check App" <${process.env.SMPT_MAIL}>`,
//             to: email,
//             subject: 'OTP for Registration',
//             html: `<h3>Your OTP is: ${otp}</h3>`,
//         });
//         console.log(`Email sent to ${email}`);
//     } catch (err) {
//         console.error('Failed to send email:', err);
//     }
// };

// module.exports = sendMail;



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

module.exports = sendMail;
