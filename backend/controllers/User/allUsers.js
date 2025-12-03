const userModel = require("../../models/User")

async function allUsers(req,res){
    try{
        console.log("userid all Users",req.userId)

        
        const allUsers = await userModel.find({ _id: { $ne: req.userId } })
            .select('-password -refreshToken') 
            .lean()
        
       
        const usersWithMatchScore = allUsers.map(user => {
            
            const matchScore = Math.floor(Math.random() * 35) + 60;
            
            return {
                ...user,
                matchScore,
                skills: user.skills || [], 
                interests: user.interests || [] 
            };
        });

     
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