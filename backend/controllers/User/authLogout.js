const userModel = require("../../models/User");

async function userLogout(req,res){
    try{
        const cookies = req.cookies;
        if (!cookies?.refreshToken) return res.sendStatus(204); 
        const refreshToken = cookies.refreshToken;

        
        const foundUser = await userModel.findOne({ refreshToken }).exec();
        const cookieOptions = { 
            httpOnly: true, 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
            secure: process.env.NODE_ENV === "production" 
        };
        
        if (!foundUser) {
            res.clearCookie('refreshToken', cookieOptions);
            return res.sendStatus(204);
        }

        
        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        const result = await foundUser.save();
        console.log(result);

        res.clearCookie('refreshToken', cookieOptions);
        
        res.status(200).json({
            message : "Logged out successfully",
            error : false,
            success : true,
            data : []
        })


    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}

module.exports = userLogout