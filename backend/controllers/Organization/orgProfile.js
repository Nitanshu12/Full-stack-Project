const userModel = require("../../models/User");

async function orgProfile(req, res) {
    try {
        if (req.method === 'GET') {
            const user = await userModel.findById(req.userId)
                .select('-password -refreshToken')
                .lean();

            if (!user) {
                return res.status(404).json({
                    message: "Organization not found",
                    error: true,
                    success: false
                });
            }

            return res.status(200).json({
                data: user,
                success: true,
                error: false,
                message: "Organization profile fetched"
            });
        }

        if (req.method === 'PUT') {
            const { orgName, orgDescription, website, name } = req.body;
            const updateData = {};

            if (orgName !== undefined) updateData.orgName = orgName;
            if (orgDescription !== undefined) updateData.orgDescription = orgDescription;
            if (website !== undefined) updateData.website = website;
            if (name !== undefined) updateData.name = name;

            const user = await userModel.findByIdAndUpdate(
                req.userId,
                updateData,
                { new: true }
            ).select('-password -refreshToken');

            return res.status(200).json({
                data: user,
                success: true,
                error: false,
                message: "Organization profile updated"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = orgProfile;
