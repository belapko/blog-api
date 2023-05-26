const Router = require('express').Router;
const userController = require('../controllers/user.controller');
const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const isPostAuthorMiddleware = require('../middlewares/isPostAuthor.middleware');
const isCommentAuthorMiddleware = require('../middlewares/isCommentAuthor.middleware')

const router = new Router();

router.post('/registration', body('email').isEmail(), body('password').isLength({min: 8}), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.post('/post', authMiddleware, postController.create);
router.get('/post/:id?', postController.read);
router.patch('/post/:id', authMiddleware, isPostAuthorMiddleware, postController.update);
router.delete('/post/:id', authMiddleware, isPostAuthorMiddleware, postController.delete);

router.post('/:post/comment/', authMiddleware, commentController.create);
router.get('/:post/comment/', commentController.read);
router.patch('/comment/:id', authMiddleware, isCommentAuthorMiddleware, commentController.update);
router.delete('/comment/:id', authMiddleware, isCommentAuthorMiddleware, commentController.delete);

module.exports = router;