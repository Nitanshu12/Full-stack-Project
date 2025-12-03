const userModel = require('../../models/User');

async function updateProfileController(req, res) {
    try {
        const userId = req.userId; // From auth middleware
        const { skills, interests } = req.body;

        // Validate that at least one field is provided
        if (skills === undefined && interests === undefined) {
            return res.status(400).json({
                message: 'Please provide skills or interests to update',
                error: true,
                success: false
            });
        }

        // Build update object
        const updateData = {};
        if (skills !== undefined) {
            // Ensure skills is an array
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    message: 'Skills must be an array',
                    error: true,
                    success: false
                });
            }
            updateData.skills = skills;
        }

        if (interests !== undefined) {
            // Ensure interests is an array
            if (!Array.isArray(interests)) {
                return res.status(400).json({
                    message: 'Interests must be an array',
                    error: true,
                    success: false
                });
            }
            updateData.interests = interests;
        }

        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        res.status(200).json({
            data: updatedUser,
            success: true,
            error: false,
            message: 'Profile updated successfully'
        });

    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({
            message: err.message || 'Error updating profile',
            error: true,
            success: false
        });
    }
}

module.exports = updateProfileController;

