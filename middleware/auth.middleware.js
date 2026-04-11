import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.redirect('/user/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/user/login');
    }
};

export default requireAuth;