const Admin = require('../model/admin.model');
const Check = require('../model/check.model');
const Vender = require('../model/user.model');
const Ticket = require('../model/ticket.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require("moment");

require('dotenv').config();

exports.adminRegister = async (req, res) => {
    try {
        const { firstname, lastname, mobile, bussiness, email, password } = req.body;
        const adminExist = await Admin.findOne({ email });
        if (adminExist) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newAdmin = new Admin({ firstname, lastname, mobile, bussiness, email, password: hashedPassword, otp });
        await newAdmin.save();


        res.json({ message: 'admin register successfully.' });
    } catch (error) {
        console.log(error)
    }
}

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found or not verified' });

    const isMatch = bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: admin.role, adminId: admin._id, message: 'Login successful' });
};

exports.dashboardDetailss = async (req, res) => {
    try {
        const checks = await Check.find();
        const vendors = await Vender.find();

        const totalVendor = vendors.length;

        // Today range
        const startOfToday = moment().startOf("day");
        const endOfToday = moment().endOf("day");

        // New checks = created today
        const newCheck = checks.filter((c) =>
            moment(c.createdAt).isBetween(startOfToday, endOfToday, null, '[]')
        ).length;

        const goodCheck = checks.filter((c) => c.status === "good").length;
        const badCheck = checks.filter((c) => c.status === "bad").length;

        // Sum of today's check amounts
        const todayChecks = checks.filter((c) =>
            moment(c.createdAt).isBetween(startOfToday, endOfToday, null, '[]')
        );
        const todayStatus = todayChecks.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

        // Weekly (last 7 days)
        const weeklyChecks = checks.filter((c) =>
            moment(c.createdAt).isAfter(moment().subtract(7, "days"))
        );
        const weeklyStatus = weeklyChecks.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

        // Monthly (last 30 days)
        const monthlyChecks = checks.filter((c) =>
            moment(c.createdAt).isAfter(moment().subtract(30, "days"))
        );
        const monthlyStatus = monthlyChecks.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);



        res.status(200).json({
            totalVendor,
            newCheck,
            goodCheck,
            badCheck,
            todayStatus,
            weeklyStatus,
            monthlyStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addUser = async (req, res) => {
    const { firstname, middlename, lastname, role, mobile, bussiness, email, password } = req.body;
    const userExist = await Vender.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new Vender({ firstname, middlename, lastname, role, mobile, bussiness, email, password: hashedPassword, otp, otpVerified: true });
    await newUser.save();


    res.json({ message: 'User added successfully.', newUser });
};

exports.getAllUsers = async (req, res) => {
    try {
        const Users = await Vender.find();
        return res.status(200).json({ message: 'All Users fetched successfully', data: Users });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return res.status(500).json({ message: 'Failed to fetch Users', error: error.message });
    }
};

exports.getAllUsersById = async (req, res) => {
    try {
        const { id } = req.params;

        const Users = await Vender.findById(id);
        if (!Users) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User fetched successfully', data: Users });
    } catch (error) {
        console.error('Error in getCheckById:', error);
        return res.status(500).json({ message: 'Failed to fetch User', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await Vender.findByIdAndUpdate(id, req.body, {
            new: true, // return updated document
            runValidators: true, // ensure validations run
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        console.error('Error in updateUser:', error);
        return res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await Vender.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User deleted successfully',
            data: deletedUser,
        });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        return res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

exports.getAllChecks = async (req, res) => {
    try {
        const Checks = await Check.find().populate('venderId'); // Populates the vendor details
        return res.status(200).json({ message: 'All Checks fetched successfully', data: Checks });
    } catch (error) {
        console.error('Error in getAllChecks:', error);
        return res.status(500).json({ message: 'Failed to fetch Checks', error: error.message });
    }
};

exports.getAllChecksById = async (req, res) => {
    try {
        const { id } = req.params;

        const Checks = await Check.findById(id);
        if (!Checks) {
            return res.status(404).json({ message: 'Check not found' });
        }

        return res.status(200).json({ message: 'Check fetched successfully', data: Checks });
    } catch (error) {
        console.error('Error in getCheckById:', error);
        return res.status(500).json({ message: 'Failed to fetch Check', error: error.message });
    }
};

exports.updateCheck = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCheck = await Check.findByIdAndUpdate(id, req.body, {
            new: true, // return updated document
            runValidators: true, // ensure validations run
        });

        if (!updatedCheck) {
            return res.status(404).json({ message: 'Check not found' });
        }

        return res.status(200).json({
            message: 'Check updated successfully',
            data: updatedCheck,
        });
    } catch (error) {
        console.error('Error in updateCheck:', error);
        return res.status(500).json({ message: 'Failed to update Check', error: error.message });
    }
};

exports.deleteCheck = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCheck = await Check.findByIdAndDelete(id);

        if (!deletedCheck) {
            return res.status(404).json({ message: 'Check not found' });
        }

        return res.status(200).json({
            message: 'Check deleted successfully',
            data: deletedCheck,
        });
    } catch (error) {
        console.error('Error in deleteCheck:', error);
        return res.status(500).json({ message: 'Failed to delete Check', error: error.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findById(id).populate('vendorId'); // assumes vendorId is a ref

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket', error: error.message });
    }
};



exports.dashboardDetail = async (req, res) => {
    try {
        const checks = await Check.find();
        const vendors = await Vender.find();

        const totalVendor = vendors.length;

        // Today's range
        const startOfToday = moment().startOf("day");
        const endOfToday = moment().endOf("day");

        // New checks (today)
        const newCheck = checks.filter((c) =>
            moment(c.createdAt).isBetween(startOfToday, endOfToday, null, "[]")
        ).length;

        // Stats
        const newcustomer = checks.filter((c) => c.customerStatus === "new customer").length;
        const verifiedcustomer = checks.filter((c) => c.customerStatus === "verified customer").length;

        // Amounts
        const todayChecks = checks.filter((c) =>
            moment(c.createdAt).isBetween(startOfToday, endOfToday, null, "[]")
        );
        const todayStatus = todayChecks.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

        const weeklyChecks = checks.filter((c) =>
            moment(c.createdAt).isAfter(moment().subtract(7, "days"))
        );
        const weeklyStatus = weeklyChecks.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

        const monthlyChecks = checks.filter((c) =>
            moment(c.createdAt).isAfter(moment().subtract(30, "days"))
        );
        const monthlyStatus = monthlyChecks.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

        // Pie chart for check status
        const checkStatus = [
            { label: "New Customer", value: newcustomer },
            { label: "Verified Customer", value: verifiedcustomer },

        ];

        // 1. Daily – Total number of checks for today, returned as an array like [3]
        const today = moment().startOf('day');
        const dailyTotal = todayChecks.reduce((count, c) => {
            const createdAt = moment(c.createdAt);
            return createdAt.isSame(today, 'day') ? count + 1 : count;
        }, 0);
        const dailyData = [dailyTotal]; // <-- Wrap in array

        // 2. Weekly – Counts for current week (Monday to Sunday)
        const startOfWeek = moment().startOf('isoWeek'); // Monday
        const endOfWeek = moment().endOf('isoWeek');     // Sunday
        const weeklyData = Array(7).fill(0); // [Mon, Tue, ..., Sun]

        weeklyChecks.forEach((c) => {
            const createdAt = moment(c.createdAt);
            if (createdAt.isBetween(startOfWeek, endOfWeek, null, '[]')) {
                const day = createdAt.isoWeekday(); // 1 (Mon) to 7 (Sun)
                weeklyData[day - 1] += 1;
            }
        });

        // 3. Monthly – Aggregates per month of the current year
        const monthlyData = Array(12).fill(0); // Jan (0) to Dec (11)
        monthlyChecks.forEach((c) => {
            const createdAt = moment(c.createdAt);
            if (createdAt.isSame(moment(), 'year')) {
                const month = createdAt.month(); // 0 (Jan) to 11 (Dec)
                monthlyData[month] += 1;
            }
        });





        res.status(200).json({
            totalVendor,
            newCheck,
            newcustomer,
            verifiedcustomer,
            todayStatus,
            weeklyStatus,
            monthlyStatus,
            chart: {
                daily: dailyData,        // [0, 1, 2, ..., 23]
                weekly: weeklyData,      // [56, 64, 76, 78, 78, 37, 20]
                monthly: monthlyData,  // [{ date: '2024-09-20', count: 5 }, ...]
                checkStatus: checkStatus // pie chart
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};