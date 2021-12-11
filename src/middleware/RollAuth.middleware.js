const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const reqToken = req.body.token || req.query.token || req.headers.authorization;

    if (!reqToken) {
        return res.status(403).json({ success: false, message: "A token is required for authentication" })
    }

    let token = reqToken.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode;
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalide token!' })
    }
    return next();
}

module.exports = verifyToken;