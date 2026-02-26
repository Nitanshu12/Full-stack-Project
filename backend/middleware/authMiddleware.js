const jwt = require('jsonwebtoken')
const userModel = require('../models/User')

async function authToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(200).json({
                message: 'Please Login...!',
                error: true,
                success: false
            })
        }

        jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.TOKEN_SECRET_KEY, async function (err, decoded) {
            if (err) {
                console.log('error auth', err)
                return res.sendStatus(403); // Invalid token
            }

            req.userId = decoded?._id
            req.userEmail = decoded?.email

            // Fetch user to get current role and status
            try {
                const user = await userModel.findById(decoded._id).select('role status');
                if (!user) {
                    return res.status(401).json({
                        message: 'User not found',
                        error: true,
                        success: false
                    });
                }

                if (user.status === 'BLOCKED') {
                    return res.status(403).json({
                        message: 'Your account has been blocked. Please contact support.',
                        error: true,
                        success: false
                    });
                }

                req.userRole = user.role;
                req.userStatus = user.status;
            } catch (dbErr) {
                console.log('Error fetching user role:', dbErr);
                return res.status(500).json({
                    message: 'Internal server error',
                    error: true,
                    success: false
                });
            }

            next()
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        })
    }
}


module.exports = authToken