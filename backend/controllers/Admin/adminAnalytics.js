const userModel = require("../../models/User");
const projectModel = require("../../models/Project");
const postModel = require("../../models/Post");

async function adminAnalytics(req, res) {
    try {
        const [
            totalUsers,
            studentCount,
            mentorCount,
            orgCount,
            adminCount,
            activeCount,
            pendingCount,
            blockedCount,
            totalProjects,
            totalPosts,
            recentSignups
        ] = await Promise.all([
            userModel.countDocuments(),
            userModel.countDocuments({ role: 'STUDENT' }),
            userModel.countDocuments({ role: 'MENTOR' }),
            userModel.countDocuments({ role: 'ORGANIZATION' }),
            userModel.countDocuments({ role: 'ADMIN' }),
            userModel.countDocuments({ status: 'ACTIVE' }),
            userModel.countDocuments({ status: 'PENDING' }),
            userModel.countDocuments({ status: 'BLOCKED' }),
            projectModel.countDocuments(),
            postModel.countDocuments(),
            userModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email role status createdAt')
                .lean()
        ]);

        res.status(200).json({
            data: {
                totalUsers,
                roleBreakdown: {
                    students: studentCount,
                    mentors: mentorCount,
                    organizations: orgCount,
                    admins: adminCount
                },
                statusBreakdown: {
                    active: activeCount,
                    pending: pendingCount,
                    blocked: blockedCount
                },
                totalProjects,
                totalPosts,
                recentSignups
            },
            success: true,
            error: false,
            message: "Analytics fetched successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = adminAnalytics;
