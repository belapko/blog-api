const {PrismaClient} = require('@prisma/client');
const prismadb = new PrismaClient()


exports.create = async (userId, title, text) => {
    return prismadb.post.create({
        data: {
            userId,
            title,
            text
        }
    });
}

exports.read = async (id) => {
    if (id) {
        return prismadb.post.findFirst({
            where: {
                id
            }
        });
    }
    return prismadb.post.findMany();
}

exports.update = async (id, body) => {
    return prismadb.post.update({
        where: {
            id
        },
        data: {
            ...body
        }
    });
}

exports.delete = async (id) => {
    return prismadb.post.delete({
        where: {
            id
        }
    });
}