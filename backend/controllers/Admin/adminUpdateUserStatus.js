const userModel = require("../../models/User");

async function adminUpdateUserStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'ACTIVE', 'BLOCKED'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be PENDING, ACTIVE, or BLOCKED.",
                error: true,
                success: false
            });
        }

        const user = await userModel.findByIdAndUpdate(
            id,
            { status },
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
            message: `User status updated to ${status}`
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = adminUpdateUserStatus;
