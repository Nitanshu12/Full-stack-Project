const userModel = require("../../models/User");

async function adminUpdateUserRole(req, res) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['STUDENT', 'MENTOR', 'ORGANIZATION', 'ADMIN'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Must be STUDENT, MENTOR, ORGANIZATION, or ADMIN.",
                error: true,
                success: false
            });
        }

        const user = await userModel.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        res.status(200).json({
            data: user,
            success: true,
            error: false,
            message: `User role updated to ${role}`
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = adminUpdateUserRole;
