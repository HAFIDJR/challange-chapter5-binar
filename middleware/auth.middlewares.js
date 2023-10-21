const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    restrict: (req, res, next) => {
        let { authorization } = req.headers;
        let token = authorization.split(" ")[1]       
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized',
                err: 'missing token on header!',
                data: null
            });
        }
        jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized',
                    err: err.message,
                    data: null
                });
            }
            req.user = await prisma.users.findUnique({ where: { id: decoded.id } });
            next();
        });
    }
};