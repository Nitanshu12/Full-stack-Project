/**
 * Role-based authorization middleware factory.
 * Usage: authorizeRole('ADMIN') or authorizeRole('STUDENT', 'ADMIN')
 */
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(403).json({
                message: 'Access denied. Role not determined.',
                error: true,
                success: false
            });
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
                error: true,
                success: false
            });
        }

        next();
    };
}

module.exports = authorizeRole;
