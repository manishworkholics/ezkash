const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');

// exports.registerVendor = async (req, res) => {
//     const { firstname, lastname, mobile, bussiness, email, password } = req.body;
//     const userExist = await User.findOne({ email });
//     if (userExist) return res.status(400).json({ message: 'Email already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const newUser = new User({ firstname, lastname, mobile, bussiness, email, password: hashedPassword, otp });
//     await newUser.save();
//     await sendMail(email, otp);

//     res.json({ message: 'OTP sent to email. Please verify.' });
// };

exports.registerVendor = async (req, res) => {
    const { firstname, lastname, mobile, bussiness, email, password } = req.body;

    // Check for existing email
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Check for existing mobile number
    const mobileExist = await User.findOne({ mobile });
    if (mobileExist) {
        return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
        firstname,
        lastname,
        mobile,
        bussiness,
        email,
        password: hashedPassword,
        otp
    });

    await newUser.save();
    await sendMail(email, otp);

    res.json({ message: 'OTP sent to email. Please verify.' });
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
        await sendMail(email, otp);
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

    const token = jwt.sign({ id: user._id, role: user.role }, 'secret_key', { expiresIn: '1d' });
    res.json({ token, role: user.role, userId: user._id, message: 'Login successful' });
};



exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp;
    user.otpVerified = false; // optional: reset verification
    await user.save();

    try {
        await sendMail(email, otp);
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