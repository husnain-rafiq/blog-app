import express from 'express';
import acl from 'express-acl';
import auth from '../middlewares/auth';
import UserController from './user/user.controller';
import PostController from './post/post.controller';
import CommentController from './comment/comment.controller';

const router = express.Router();

// list of routes to be excluded from authentication and authorization
const aclExcludedRoutes = ['/api/users/googleLogin', '/api/users/login', /^\/api-docs\/.*/];

acl.config({
  baseUrl: 'api',
  filename: 'acl.json',
  path: 'src/config',
  decodedObjectName: 'user',
});

// console.log(
//   'auth.required.unless({ path: aclExcludedRoutes })================',
//   auth.required.unless({ path: aclExcludedRoutes })
// );
router.use(auth.required.unless({ path: aclExcludedRoutes }));
router.use(acl.authorize.unless({ path: aclExcludedRoutes }));

router.use('/users', UserController.getRouter());
router.use('/posts', PostController.getRouter());
router.use('/comments', CommentController.getRouter());

export default router;
