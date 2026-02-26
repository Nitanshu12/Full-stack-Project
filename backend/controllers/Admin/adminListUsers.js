const userModel = require("../../models/User");

async function adminListUsers(req, res) {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            role = '',
            status = ''
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter = {};

        if (role && ['STUDENT', 'MENTOR', 'ORGANIZATION', 'ADMIN'].includes(role)) {
            filter.role = role;
        }

        if (status && ['PENDING', 'ACTIVE', 'BLOCKED'].includes(status)) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const [users, totalUsers] = await Promise.all([
            userModel.find(filter)
                .select('-password -refreshToken')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            userModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalUsers / limitNum);

        res.status(200).json({
            data: {
                users,
                totalUsers,
                totalPages,
                currentPage: pageNum,
                limit: limitNum
            },
            success: true,
            error: false,
            message: "Users fetched successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = adminListUsers;
