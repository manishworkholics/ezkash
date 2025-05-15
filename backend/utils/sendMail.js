// const nodemailer = require('nodemailer');

// const sendMail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: 'manishkushwah163@gmail.com',
//       pass: 'kush@1503',
//     },
//   });

//   await transporter.sendMail({
//     from: '"Check App" <manish.workholics@gmail.com>',
//     to: email,
//     subject: 'OTP for Registration',
//     html: `<h3>Your OTP is: ${otp}</h3>`,
//   });
// };

// module.exports = sendMail;


const nodemailer = require("nodemailer");

const sendMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: '"Check App" <pinkspot.ap@gmail.com>',
        to: email,
        subject: 'OTP for Registration',
        html: `<h3>Your OTP is: ${otp}</h3>`,
    });

   

};

module.exports = sendMail;

