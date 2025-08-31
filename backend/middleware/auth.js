const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async(req,res,next)=>{
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token) return res.status(401).json({msg:"Not authorized, no token"})
    try{
        // Try both secrets: first JWT_SECRET, then ASSIGNMENT_SEED if JWT_SECRET fails
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // Try ASSIGNMENT_SEED for admin
            try {
                decoded = jwt.verify(token, process.env.ASSIGNMENT_SEED);
            } catch (err2) {
                return res.status(401).json({msg:"Not authorized, token failed"});
            }
        }
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }catch(err){
        res.status(401).json({msg:"Not authorized, token failed"})
    }
}


const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        // Allow case-insensitive match for roles
        const allowed = roles.some(role => role.toLowerCase() === userRole?.toLowerCase());
        if (!allowed) return res.status(401).json({ msg: "Not authorized to access this route" });
        next();
    }
}

module.exports = { protect, authorize };

