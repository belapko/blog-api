const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail.service');
const tokenService = require("./token.service");
const ApiError = require('../exceptions/api.exceptions');
const jwt = require('jsonwebtoken');

const {PrismaClient} = require('@prisma/client');
const prismadb = new PrismaClient()

const setTokens = async (user) => {
    const tokens = tokenService.generateTokens({...user});
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return {...tokens, id: user.id, email: user.email, isActivated: user.isActivated}
}

exports.registration = async (email, password) => {
    const userExists = await prismadb.user.findFirst({
        where: {
            email
        }
    });
    if (userExists) {
        throw ApiError.BadRequest('Пользователь с таким email уже существует.');
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await prismadb.user.create({
        data: {
            email,
            password: hashedPassword,
            activationLink
        }
    });

    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    return setTokens(user);
}

exports.activate = async (activationLink) => {
    const user = await prismadb.user.findFirst({
        where: {
            activationLink
        }
    });
    if (!user) {
        throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    await prismadb.user.update({
        where: {
            id: user.id
        },
        data: {
            isActivated: true
        }
    });
}

exports.login = async (email, password) => {
    const user = await prismadb.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        throw ApiError.BadRequest('Пользователь с таким email не существует')
    }

    const passwordsEquals = await bcrypt.compare(password, user.password);
    if (!passwordsEquals) {
        throw ApiError.BadRequest('Введён неверный пароль')
    }

    return setTokens(user);
}

exports.logout = async (refreshToken) => {
    return tokenService.removeToken(refreshToken);
}

exports.refresh = async (refreshToken) => {
    if (!refreshToken) {
        throw ApiError.UnauthorizedError();
    }

    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const token = await prismadb.token.findFirst({
        where: {
            refreshToken
        }
    });

    if (!userData || !token) {
        throw ApiError.UnauthorizedError();
    }

    const user = await prismadb.user.findFirst({
        where: {
            id: userData.id
        }
    });

    return setTokens(user);
}

exports.getAllUsers = async () => {
    return prismadb.user.findMany();
}