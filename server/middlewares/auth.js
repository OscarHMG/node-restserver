const jwt = require('jsonwebtoken');


// ==================
// == Verify TOKEN ==
// ==================


let verifyToken = (req, resp, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED_SIGN, (error, decoded) => {
        if (error) {
            return resp.status(401).json({
                ok: false,
                error
            });
        }

        req.user = decoded.user;
        next();

    });
};


let verifyRole = (req, resp, next) => {
    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return resp.status(403).json({
            ok: false,
            error: {
                message: 'Only ADMIN_ROLE has this permission'
            }
        });
    }

    next();
}

module.exports = {
    verifyToken,
    verifyRole
};