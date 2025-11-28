const bcrypt = require('bcryptjs')
const userModel = require('../../models/User')
const jwt = require('jsonwebtoken');

async function userSignInController(req,res){
    try{
        const { email , password} = req.body

        if(!email){
            throw new Error("Please provide email")
        }
        if(!password){
             throw new Error("Please provide password")
        }

        const user = await userModel.findOne({email})

       if(!user){
            throw new Error("User not found")
       }

       const checkPassword = await bcrypt.compare(password,user.password)

       console.log("checkPassoword",checkPassword)

       if(checkPassword){
        const tokenData = {
            _id : user._id,
            email : user.email,
        }
        
        const accessToken = await jwt.sign(tokenData, process.env.JWT_ACCESS_SECRET || process.env.TOKEN_SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = await jwt.sign(tokenData, process.env.JWT_REFRESH_SECRET || process.env.TOKEN_SECRET_KEY, { expiresIn: '7d' });

        // Save refresh token to DB
        user.refreshToken = [...(user.refreshToken || []), refreshToken];
        await user.save();

        const tokenOption = {
            httpOnly : true,
            secure : true,
            sameSite: 'None' // Important for cross-site if frontend/backend on different ports/domains
        }

        res.cookie("refreshToken", refreshToken, tokenOption).status(200).json({
            message : "Login successfully",
            data : {
                accessToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            },
            success : true,
            error : false
        })

       }else{
         throw new Error("Please check Password")
       }

    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }

}

module.exports = userSignInController