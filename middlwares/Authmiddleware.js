import jwt from 'jsonwebtoken';

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({
            message: "Invalid auth header",
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId && decoded.role) {
            req.userId =decoded.userId;
            req.role=decoded.role;
            next();
        }
        else {
            return res.status(403).json({
                message: "Invalid auth header",
            });
        }

    } catch (error) {
        return res.status(403).json({
            message: "Invalid auth header",
        });
    }
};

export default authMiddleWare;