const Check = require('../model/check.model');


// exports.addCheckDetail = async (req, res) => {
//     try {
//         const { imageUrl, imageUrl2, imageUrl3, imageUrl4, customerFirstName, customerMiddleName, customerLastName, licenseNo, date, company, checkType, amount, status, extractedText, comment, venderId } = req.body;

//         const newCheck = new Check({ imageUrl, imageUrl2, imageUrl3, imageUrl4, customerFirstName, customerMiddleName, customerLastName, licenseNo, date, company, checkType, amount, status, extractedText, comment, venderId });

//         await newCheck.save();

//         return res.status(201).json({
//             message: 'Check details added successfully',
//             data: newCheck,
//         });
//     } catch (error) {
//         console.error('Error in addCheckDetail:', error);
//         return res.status(500).json({
//             message: 'Something went wrong while saving check details',
//             error: error.message,
//         });
//     }
// };



// exports.addCheckDetail = async (req, res) => {
//     try {
//         const {
//             imageUrl,
//             imageUrl2,
//             imageUrl3,
//             imageUrl4,
//             customerFirstName,
//             customerMiddleName,
//             customerLastName,
//             licenseNo,
//             date,
//             company,
//             checkType,
//             amount,
//             status,
//             extractedText,
//             comment,
//             venderId
//         } = req.body;

//         // Normalize input (trim and lowercase)
//         const normalizedFirstName = customerFirstName?.trim().toLowerCase() || '';
//         const normalizedMiddleName = customerMiddleName?.trim().toLowerCase() || '';
//         const normalizedLastName = customerLastName?.trim().toLowerCase() || '';
//         const normalizedLicenseNo = licenseNo?.trim().toLowerCase() || '';

//         // Case-insensitive match using regex
//         const existingCheck = await Check.findOne({
//             customerFirstName: new RegExp(`^${normalizedFirstName}$`, 'i'),
//             customerMiddleName: new RegExp(`^${normalizedMiddleName}$`, 'i'),
//             customerLastName: new RegExp(`^${normalizedLastName}$`, 'i'),
//             licenseNo: new RegExp(`^${normalizedLicenseNo}$`, 'i'),
//         });

//         const customerStatus = existingCheck ? "verified customer" : "new customer";

//         const newCheck = new Check({
//             imageUrl,
//             imageUrl2,
//             imageUrl3,
//             imageUrl4,
//             customerFirstName: customerFirstName?.trim(),
//             customerMiddleName: customerMiddleName?.trim(),
//             customerLastName: customerLastName?.trim(),
//             licenseNo: licenseNo?.trim(),
//             date,
//             company,
//             checkType,
//             amount,
//             status,
//             extractedText,
//             comment,
//             venderId,
//             customerStatus
//         });

//         await newCheck.save();

//         return res.status(201).json({
//             message: 'Check details added successfully',
//             data: newCheck,
//         });
//     } catch (error) {
//         console.error('Error in addCheckDetail:', error);
//         return res.status(500).json({
//             message: 'Something went wrong while saving check details',
//             error: error.message,
//         });
//     }
// };


exports.addCheckDetail = async (req, res) => {
    try {
        const {
            imageUrl, imageUrl2, imageUrl3, imageUrl4,
            customerFirstName, customerMiddleName, customerLastName,
            licenseNo, date, company, checkType, amount,
            status, extractedText, comment, venderId
        } = req.body;

        // Normalize for consistent matching
        const normalizedFirstName = customerFirstName?.trim().toLowerCase();
        const normalizedMiddleName = customerMiddleName?.trim().toLowerCase();
        const normalizedLastName = customerLastName?.trim().toLowerCase();
        const normalizedLicenseNo = licenseNo?.trim();

        // Save as 'new customer' by default
        const newCheck = new Check({
            imageUrl, imageUrl2, imageUrl3, imageUrl4,
            customerFirstName, customerMiddleName, customerLastName,
            licenseNo, date, company, checkType, amount,
            status, extractedText, comment, venderId,
            customerStatus: 'new customer'
        });

        await newCheck.save();

        // After saving, count how many checks exist for this customer
        const customerChecks = await Check.find({
            customerFirstName: { $regex: new RegExp(`^${normalizedFirstName}$`, 'i') },
            customerMiddleName: { $regex: new RegExp(`^${normalizedMiddleName}$`, 'i') },
            customerLastName: { $regex: new RegExp(`^${normalizedLastName}$`, 'i') },
            licenseNo: normalizedLicenseNo
        });

        // If more than one, update all to 'verified customer'
        if (customerChecks.length > 1) {
            await Check.updateMany(
                {
                    customerFirstName: { $regex: new RegExp(`^${normalizedFirstName}$`, 'i') },
                    customerMiddleName: { $regex: new RegExp(`^${normalizedMiddleName}$`, 'i') },
                    customerLastName: { $regex: new RegExp(`^${normalizedLastName}$`, 'i') },
                    licenseNo: normalizedLicenseNo
                },
                { $set: { customerStatus: 'verified customer' } }
            );
        }

        return res.status(201).json({
            message: 'Check details added successfully',
            data: newCheck,
        });
    } catch (error) {
        console.error('Error in addCheckDetail:', error);
        return res.status(500).json({
            message: 'Something went wrong while saving check details',
            error: error.message,
        });
    }
};



exports.getAllChecks = async (req, res) => {
    try {
        const checks = await Check.find();
        return res.status(200).json({ message: 'All checks fetched successfully', data: checks });
    } catch (error) {
        console.error('Error in getAllChecks:', error);
        return res.status(500).json({ message: 'Failed to fetch checks', error: error.message });
    }
};

exports.getCheckByVenderId = async (req, res) => {
    try {
        const { venderId } = req.params;
        const checks = await Check.find({ venderId }).sort({ createdAt: -1 });

        if (!checks.length) {
            return res.status(404).json({ message: 'No checks found for this vendor' });
        }

        return res.status(200).json({ message: 'Checks fetched successfully', data: checks });
    } catch (error) {
        console.error('Error in getCheckByVenderId:', error);
        return res.status(500).json({ message: 'Failed to fetch checks', error: error.message });
    }
};

exports.getRecentChecksByVenderId = async (req, res) => {
    try {
        const { venderId } = req.params;

        const recentChecks = await Check.find({ venderId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(5);               // Limit to 5 recent entries

        if (!recentChecks.length) {
            return res.status(404).json({ message: 'No checks found for this vendor' });
        }

        return res.status(200).json({
            message: 'Recent checks fetched successfully',
            data: recentChecks
        });
    } catch (error) {
        console.error('Error in getRecentChecksByVenderId:', error);
        return res.status(500).json({
            message: 'Failed to fetch recent checks',
            error: error.message
        });
    }
};


exports.getRecentChecks = async (req, res) => {
    try {
        const recentChecks = await Check.find({})
            .sort({ createdAt: -1 }) // Sort by latest first
            .limit(5);               // Limit to 5 results

        return res.status(200).json({
            message: 'Recent checks fetched successfully',
            data: recentChecks
        });
    } catch (error) {
        console.error('Error in getRecentChecks:', error);
        return res.status(500).json({
            message: 'Failed to fetch recent checks',
            error: error.message
        });
    }
};



exports.getCheckByCompany = async (req, res) => {
    try {
        const { company } = req.params;
        const checks = await Check.find({ company });

        if (!checks.length) {
            return res.status(404).json({ message: 'No checks found for this vendor' });
        }

        return res.status(200).json({ message: 'Checks fetched successfully', data: checks });
    } catch (error) {
        console.error('Error in getCheckBycompany:', error);
        return res.status(500).json({ message: 'Failed to fetch checks', error: error.message });
    }
};


exports.getCheckById = async (req, res) => {
    try {
        const { id } = req.params;

        const check = await Check.findById(id);
        if (!check) {
            return res.status(404).json({ message: 'Check not found' });
        }

        return res.status(200).json({ message: 'Check fetched successfully', data: check });
    } catch (error) {
        console.error('Error in getCheckById:', error);
        return res.status(500).json({ message: 'Failed to fetch check', error: error.message });
    }
};


exports.updateCheckById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedCheck = await Check.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedCheck) {
            return res.status(404).json({ message: 'Check not found' });
        }

        return res.status(200).json({ message: 'Check updated successfully', data: updatedCheck });
    } catch (error) {
        console.error('Error in updateCheckById:', error);
        return res.status(500).json({ message: 'Failed to update check', error: error.message });
    }
};


exports.deleteCheckById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCheck = await Check.findByIdAndDelete(id);
        if (!deletedCheck) {
            return res.status(404).json({ message: 'Check not found' });
        }

        return res.status(200).json({ message: 'Check deleted successfully' });
    } catch (error) {
        console.error('Error in deleteCheckById:', error);
        return res.status(500).json({ message: 'Failed to delete check', error: error.message });
    }
};


exports.getCheckStatuss = async (req, res) => {
    try {
        const { type } = req.query; // type can be 'day', 'week', or 'month'
        if (!['day', 'week', 'month'].includes(type)) {
            return res.status(400).json({ message: 'Invalid type. Use day, week, or month.' });
        }

        const now = new Date();
        let startDate;

        if (type === 'day') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (type === 'week') {
            const firstDayOfWeek = now.getDate() - now.getDay(); // Sunday as start
            startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
        } else if (type === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const checks = await Check.find({ createdAt: { $gte: startDate } });

        const totalAmount = checks.reduce((sum, check) => sum + (Number(check.amount) || 0), 0);
        const totalChecks = checks.length;
        const goodChecks = checks.filter(c => c.status === 'good').length;
        const badChecks = checks.filter(c => c.status === 'bad').length;

        res.status(200).json({
            type,
            from: startDate,
            to: now,
            totalAmount,
            totalChecks,
            goodChecks,
            badChecks
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch check stats', error: error.message });
    }
};


exports.getCheckStatus = async (req, res) => {
    try {
        const now = new Date();

        // Helper function to calculate stats
        const calculateStats = async (startDate) => {
            const checks = await Check.find({ createdAt: { $gte: startDate } });

            const totalAmount = checks.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
            const totalChecks = checks.length;
            const goodChecks = checks.filter(c => c.status === 'good').length;
            const badChecks = checks.filter(c => c.status === 'bad').length;

            return {
                from: startDate,
                to: now,
                totalAmount,
                totalChecks,
                goodChecks,
                badChecks
            };
        };

        // Start dates for day, week, month
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [dayStats, weekStats, monthStats] = await Promise.all([
            calculateStats(startOfDay),
            calculateStats(startOfWeek),
            calculateStats(startOfMonth),
        ]);

        res.status(200).json({
            day: dayStats,
            week: weekStats,
            month: monthStats
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch check statistics', error: error.message });
    }
};


exports.getCheckStatusByVenderId = async (req, res) => {
    try {
        const { venderId } = req.query; // Or use req.params if passed via route param

        if (!venderId) {
            return res.status(400).json({ message: 'vendorId is required' });
        }

        const now = new Date();

        const calculateStats = async (startDate) => {
            const checks = await Check.find({
                venderId, // Make sure this field exists in your Check schema
                createdAt: { $gte: startDate }
            });

            const totalAmount = checks.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
            const totalChecks = checks.length;
            const goodChecks = checks.filter(c => c.status === 'good').length;
            const badChecks = checks.filter(c => c.status === 'bad').length;

            return {
                from: startDate,
                to: now,
                totalAmount,
                totalChecks,
                goodChecks,
                badChecks
            };
        };

        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [dayStats, weekStats, monthStats] = await Promise.all([
            calculateStats(startOfDay),
            calculateStats(startOfWeek),
            calculateStats(startOfMonth),
        ]);

        res.status(200).json({
            venderId,
            day: dayStats,
            week: weekStats,
            month: monthStats
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch check statistics', error: error.message });
    }
};
