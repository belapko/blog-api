const {PrismaClient} = require('@prisma/client');
const prismadb = new PrismaClient()

exports.create = async (userId, postId, text) => {
    return prismadb.comment.create({
        data:
            {
                userId,
                postId,
                text
            }
    });
}

exports.read = async (postId) => {
    return prismadb.comment.findMany({
        where: {
            postId
        }
    });
}

exports.update = async (id, text) => {
    return prismadb.comment.update({
        where: {
            id
        },
        data: {
            text
        }
    });
}

exports.delete = async (id) => {
    return prismadb.comment.delete({
        where: {
            id
        }
    });
}