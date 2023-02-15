import { Router } from 'express';
import { ROUTES } from '../helpers/routes.js';
import { articleRoutes } from './article.routes.js';
import { userRoutes } from './user.routes.js';
import { categoryRoutes } from './category.routes.js';
import { commentRoutes } from './comment.routes.js';
import { imagesRoutes } from './images.routes.js';

const router = new Router();

router.use(ROUTES.USER_ROUTES, userRoutes);
router.use(ROUTES.ARTICLE_ROUTES, articleRoutes);
router.use(ROUTES.CATEGORY_ROUTES, categoryRoutes);
router.use(ROUTES.COMMENT_ROUTES, commentRoutes);
router.use(ROUTES.IMAGES_ROUTES, imagesRoutes);

export default router;
