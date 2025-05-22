const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail, resendOtpMail, forgotPasswordMail } = require('../utils/sendMail');
require('dotenv').config();




exports.registerVendor = async (req, res) => {
    try {
        const { firstname, middlename, lastname, mobile, bussiness, email, password } = req.body;

        const userExist = await User.findOne({ email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (userExist && userExist.otpVerified === true) {
            return res.status(409).json({ message: 'Email already exists and verified. Please login.' });
        }

        if (userExist && userExist.otpVerified === false) {
            userExist.firstname = firstname;
            userExist.middlename = middlename;
            userExist.lastname = lastname;
            userExist.mobile = mobile;
            userExist.bussiness = bussiness;
            userExist.password = hashedPassword;
            userExist.otp = otp;
            await userExist.save();

            // Send response first
            res.status(200).json({ message: 'New OTP sent. Please verify to complete registration.' });

            // Send OTP email asynchronously
            sendMail(email, otp).catch(err => console.error("Failed to send OTP:", err));
            return;
        }

        const newUser = new User({
            firstname,
            middlename,
            lastname,
            mobile,
            bussiness,
            email,
            password: hashedPassword,
            otp,
            otpVerified: false,
        });

        await newUser.save();

        // Send response first
        res.status(201).json({ message: 'OTP sent to email. Please verify.' });

        // Send OTP email asynchronously
        sendMail(email, otp).catch(err => console.error("Failed to send OTP:", err));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};



exports.getAllVender = async (req, res) => {
    try {
        const Users = await User.find();
        return res.status(200).json({ message: 'All Users fetched successfully', data: Users });
    } catch (error) {
        console.error('Error in getAllChecks:', error);
        return res.status(500).json({ message: 'Failed to fetch Users', error: error.message });
    }
};


exports.getAllVenderId = async (req, res) => {
    try {
        const { id } = req.params;

        const Users = await User.findById(id);
        if (!Users) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User fetched successfully', data: Users });
    } catch (error) {
        console.error('Error in getCheckById:', error);
        return res.status(500).json({ message: 'Failed to fetch User', error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp === otp) {
        user.otpVerified = true;
        user.otp = null;
        await user.save();
        res.json({ message: 'OTP verified. Registration complete.' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};

exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // If already verified
    if (user.otpVerified) return res.status(400).json({ message: 'User already verified' });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Save OTP
    user.otp = otp;
    await user.save();

    // Send OTP via email
    try {
        // Send OTP email asynchronously
        resendOtpMail(email, otp).catch(err => console.error("Failed to send OTP:", err));
        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.otpVerified) return res.status(400).json({ message: 'User not found or not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, userId: user._id, message: 'Login successful' });
};



exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp;
    user.otpVerified = true; // optional: reset verification
    await user.save();

    try {
        // Send OTP email asynchronously
        forgotPasswordMail(email, otp).catch(err => console.error("Failed to send OTP:", err));
        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};


exports.verifyOtpForPasswordReset = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp === otp) {
        user.otpVerified = true;
        await user.save();
        res.json({ message: 'OTP verified. You can now reset your password.' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};


exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otpVerified) {
        return res.status(400).json({ message: 'OTP not verified' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    // user.otp = null;
    // user.otpVerified = false;
    await user.save();

    res.json({ message: 'Password reset successfully' });
};

exports.changePassword = async (req, res) => {
    try {
        const { id, oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'old password, and new password are required' });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from old password' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Error in changePassword:', error);
        res.status(500).json({ message: 'Failed to change password', error: error.message });
    }
};
