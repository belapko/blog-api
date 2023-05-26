const postService = require('../service/post.service');
const ApiError = require('../exceptions/api.exceptions')

exports.create = async (req, res, next) => {
    try {
        const {userid} = req.headers;
        const {title, text} = req.body;
        const postData = await postService.create(userid, title, text);
        return res.json(postData);
    } catch (e) {
        next(e);
    }
}

exports.read = async (req, res, next) => {
    try {
        const {id} = req.params;
        if (id) {
            const postData = await postService.read(id);
            return postData ? res.json(postData) : next(ApiError.BadRequest('Страница не найдена'));
        }
        const posts = await postService.read();
        return res.json(posts);
    } catch (e) {
        next(e);
    }
}

exports.update = async (req, res, next) => {
    try {
        const {id} = req.params;
        const body = req.body;
        const postData = await postService.update(id, body);
        return res.json(postData);
    } catch (e) {
        next(e);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const {id} = req.params;
        await postService.delete(id);
        return res.status(200).json();
    } catch (e) {
        next(e);
    }
}