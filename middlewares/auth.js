import jwt from "jsonwebtoken";

function authMiddleware(req, res, baseUrl) {
    try {
        if (baseUrl != '/todos') return true;

        const token = req.headers['auth-key'];
        if (!token) return false;

        req.user = jwt.verify(token, 'sherl0ck');
        return true;
    } catch (error) {
        return false;
    }
}

export default authMiddleware;