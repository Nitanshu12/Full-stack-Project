const userModel = require("../../models/User");
const jwt = require('jsonwebtoken');

async function refreshTokenController(req, res) {
    try {
        const cookies = req.cookies;
        if (!cookies?.refreshToken) return res.sendStatus(401);

        const refreshToken = cookies.refreshToken;
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production"
        });

        const foundUser = await userModel.findOne({ refreshToken }).exec();

        if (!foundUser) {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
                if (err) return res.sendStatus(403);

                const hackedUser = await userModel.findOne({ _id: decoded._id }).exec();
                if (hackedUser) {
                    await userModel.updateOne({ _id: hackedUser._id }, { $set: { refreshToken: [] } });
                }
            });
            return res.sendStatus(403);
        }

        const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
            if (err) {
                await userModel.updateOne({ _id: foundUser._id }, { $set: { refreshToken: [...newRefreshTokenArray] } });
            }
            if (err || foundUser._id.toString() !== decoded._id) return res.sendStatus(403);

            const accessToken = jwt.sign(
                { _id: foundUser._id, email: foundUser.email, role: foundUser.role },
                process.env.JWT_ACCESS_SECRET || process.env.TOKEN_SECRET_KEY,
                { expiresIn: '15m' }
            );

            const newRefreshToken = jwt.sign(
                { _id: foundUser._id, email: foundUser.email, role: foundUser.role },
                process.env.JWT_REFRESH_SECRET || process.env.TOKEN_SECRET_KEY,
                { expiresIn: '7d' }
            );

            await userModel.updateOne(
                { _id: foundUser._id },
                { $set: { refreshToken: [...newRefreshTokenArray, newRefreshToken] } }
            );

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ accessToken });
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = refreshTokenController;
