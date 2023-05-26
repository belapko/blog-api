const userService = require('../service/user.service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api.exceptions')


exports.registration = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Введены неверные значения', errors.array()));
        }
        const {email, password} = req.body;
        const userData = await userService.registration(email, password);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
        return res.json({user: userData});
    } catch (e) {
        next(e);
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const userData = await userService.login(email, password);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
        return res.json({user: userData});
    } catch (e) {
        next(e);
    }
}

exports.logout = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.status(200).json();
    } catch (e) {
        next(e);
    }
}

exports.activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect(`${process.env.CLIENT_URL}/activated`);
    } catch (e) {
        next(e);
    }
}

exports.refresh = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        const userData = await userService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
        return res.json({user: userData});
    } catch (e) {
        next(e);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (e) {
        next(e);
    }
}