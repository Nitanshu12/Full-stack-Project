const userModel = require("../../models/User")

async function allUsers(req,res){
    try{
        console.log("userid all Users",req.userId)

        // Get all users except the current user
        const allUsers = await userModel.find({ _id: { $ne: req.userId } })
            .select('-password -refreshToken') // Exclude sensitive data
            .lean()
        
        // Add match score calculation (placeholder for now - can be enhanced with actual matching algorithm)
        const usersWithMatchScore = allUsers.map(user => {
            // Generate a random match score between 60-95% for demo
            // In production, this would be calculated based on skills, interests, projects, etc.
            const matchScore = Math.floor(Math.random() * 35) + 60;
            
            return {
                ...user,
                matchScore,
                skills: user.skills || [], // Placeholder - add to User model later
                interests: user.interests || [] // Placeholder - add to User model later
            };
        });

        // Sort by match score (highest first)
        usersWithMatchScore.sort((a, b) => b.matchScore - a.matchScore);
        
        res.json({
            message : "All Users for matching",
            data : usersWithMatchScore,
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = allUsers