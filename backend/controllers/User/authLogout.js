const userModel = require("../../models/User");

async function userLogout(req,res){
    try{
        const cookies = req.cookies;
        if (!cookies?.refreshToken) return res.sendStatus(204); // No content
        const refreshToken = cookies.refreshToken;

        // Is refreshToken in db?
        const foundUser = await userModel.findOne({ refreshToken }).exec();
        if (!foundUser) {
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        // Delete refreshToken in db
        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        const result = await foundUser.save();
        console.log(result);

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        
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