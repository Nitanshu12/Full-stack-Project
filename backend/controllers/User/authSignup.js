const userModel = require("../../models/User")
const bcrypt = require('bcryptjs');

const VALID_ROLES = ['STUDENT', 'MENTOR', 'ORGANIZATION'];

async function userSignUpController(req, res) {
    try {
        const { email, password, name, role, expertise, bio, availability, orgName, orgDescription, website } = req.body

        const user = await userModel.findOne({ email })

        if (user) {
            throw new Error("Already user exits.")
        }

        if (!email) {
            throw new Error("Please provide email")
        }
        if (!password) {
            throw new Error("Please provide password")
        }
        if (!name) {
            throw new Error("Please provide name")
        }

        // Validate role (don't allow ADMIN signup via public endpoint)
        const selectedRole = VALID_ROLES.includes(role) ? role : 'STUDENT';

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something is wrong")
        }

        const payload = {
            name,
            email,
            password: hashPassword,
            role: selectedRole,
            status: 'ACTIVE'
        };

        // Add role-specific fields
        if (selectedRole === 'MENTOR') {
            payload.expertise = expertise || [];
            payload.bio = bio || '';
            payload.availability = availability || '';
        }

        if (selectedRole === 'ORGANIZATION') {
            payload.orgName = orgName || '';
            payload.orgDescription = orgDescription || '';
            payload.website = website || '';
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created Successfully!"
        })

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = userSignUpController