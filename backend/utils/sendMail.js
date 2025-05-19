


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
        subject: 'OTP for Registration',
        html: `<h3>Your OTP is: ${otp}</h3>`,
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('SendGrid Error:', error.response?.body || error.message);
    }
};

module.exports = sendMail;
