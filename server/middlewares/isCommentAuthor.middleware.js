const ApiError = require('../exceptions/api.exceptions');
const {PrismaClient} = require('@prisma/client');
const prismadb = new PrismaClient()

module.exports = async function (req, res, next) {
    try {
        const {userid} = req.headers;
        const commentId = req.params['id'];
        const comment = await prismadb.comment.findFirst({
            where: {
                id: commentId
            }
        });
        const post = await prismadb.post.findFirst({
            where: {
                id: comment.postId
            }
        });
        if (userid !== comment.userId && userid !== post.userId) {
            return next(ApiError.BadRequest('Только автор может редактировать или удалять свою запись'));
        }
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}