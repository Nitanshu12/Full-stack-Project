const jwt = require('jsonwebtoken')

async function authToken(req,res,next){
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        
        if(!token){
            return res.status(200).json({
                message : "Please Login...!",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            
            if(err){
                console.log("error auth", err)
                return res.sendStatus(403); // Invalid token
            }

            req.userId = decoded?._id
            req.userEmail = decoded?.email

            next()
        });


    }catch(err){
        res.status(400).json({
            message : err.message || err,
            data : [],
            error : true,
            success : false
        })
    }
}


module.exports = authToken