const userModel = require("../../models/User");

async function mentorProfile(req, res) {
    try {
        if (req.method === 'GET') {
            const user = await userModel.findById(req.userId)
                .select('-password -refreshToken')
                .lean();

            if (!user) {
                return res.status(404).json({
                    message: "Mentor not found",
                    error: true,
                    success: false
                });
            }

            return res.status(200).json({
                data: user,
                success: true,
                error: false,
                message: "Mentor profile fetched"
            });
        }

        if (req.method === 'PUT') {
            const { expertise, bio, availability, name, skills, interests } = req.body;
            const updateData = {};

            if (expertise !== undefined) updateData.expertise = expertise;
            if (bio !== undefined) updateData.bio = bio;
            if (availability !== undefined) updateData.availability = availability;
            if (name !== undefined) updateData.name = name;
            if (skills !== undefined) updateData.skills = skills;
            if (interests !== undefined) updateData.interests = interests;

            const user = await userModel.findByIdAndUpdate(
                req.userId,
                updateData,
                { new: true }
            ).select('-password -refreshToken');

            return res.status(200).json({
                data: user,
                success: true,
                error: false,
                message: "Mentor profile updated"
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

module.exports = mentorProfile;
