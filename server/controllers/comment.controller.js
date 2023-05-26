const commentService = require('../service/comment.service');

exports.create = async (req, res, next) => {
    try {
        const {userid} = req.headers;
        const {post} = req.params;
        const {text} = req.body;
        const commentData = await commentService.create(userid, post, text);
        return res.json(commentData);
    } catch (e) {
        next(e);
    }
}

exports.read = async (req, res, next) => {
    try {
        const {post} = req.params;
        const commentsData = await commentService.read(post);
        return res.json(commentsData);
    } catch (e) {
        next(e);
    }
}

exports.update = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {text} = req.body;
        const commentData = await commentService.update(id, text);
        return res.json(commentData);
    } catch (e) {
        next(e);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const {id} = req.params;
        await commentService.delete(id);
        return res.status(200).json();
    } catch (e) {
        next(e);
    }
}