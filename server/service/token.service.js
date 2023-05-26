const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const prismadb = new PrismaClient()

exports.generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1d'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {accessToken, refreshToken}
}

exports.saveToken = async (userId, refreshToken) => {
    const token = await prismadb.token.findFirst({
        where: {
            userId
        }
    });

    if (token) {
        return  prismadb.token.update({
            where: {
                id: token.id
            },
            data: {
                refreshToken
            }
        });
    }

    return prismadb.token.create({
        data: {
            userId,
            refreshToken
        }
    });
}

exports.removeToken = async (refreshToken) => {
    return prismadb.token.deleteMany({
        where: {
            refreshToken
        }
    });
}