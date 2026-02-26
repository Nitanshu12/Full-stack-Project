const { OAuth2Client } = require('google-auth-library');
const userModel = require('../../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleSigninController(req, res) {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                message: 'Missing Google ID token',
                error: true,
                success: false
            });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload?.email;
        const name = payload?.name || payload?.given_name || 'Google User';

        if (!email) {
            return res.status(400).json({
                message: 'Unable to retrieve email from Google account',
                error: true,
                success: false
            });
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                name,
                email,
                password: '',
                role: 'STUDENT',
                status: 'ACTIVE'
            });
        }

        // Check if account is blocked
        if (user.status === 'BLOCKED') {
            return res.status(403).json({
                message: 'Your account has been blocked. Please contact support.',
                error: true,
                success: false
            });
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
            role: user.role
        };

        const accessToken = await jwt.sign(
            tokenData,
            process.env.JWT_ACCESS_SECRET || process.env.TOKEN_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = await jwt.sign(
            tokenData,
            process.env.JWT_REFRESH_SECRET || process.env.TOKEN_SECRET_KEY,
            { expiresIn: '7d' }
        );

        user.refreshToken = [...(user.refreshToken || []), refreshToken];
        await user.save();

        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('refreshToken', refreshToken, tokenOption).status(200).json({
            message: 'Login with Google successful',
            data: {
                accessToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            },
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error in Google sign-in:', err);
        res.status(500).json({
            message: err.message || 'Failed to sign in with Google',
            error: true,
            success: false
        });
    }
}

module.exports = googleSigninController;
