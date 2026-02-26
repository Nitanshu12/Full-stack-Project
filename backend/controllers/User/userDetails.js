const userModel = require("../../models/User")

async function userDetailsController(req, res) {
    try {
        const user = await userModel.findById(req.userId)
            .select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details"
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = userDetailsController