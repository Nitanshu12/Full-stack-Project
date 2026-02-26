const userModel = require("../../models/User");

async function adminGetUser(req, res) {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id)
            .select('-password -refreshToken')
            .lean();

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
            message: "User details fetched"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = adminGetUser;
