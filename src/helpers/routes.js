export const ROUTES = {
  BASE: "/",
  ARTICLE_ROUTES: "/api/news",
  USER_ROUTES: "/api/user",
  CATEGORY_ROUTES: "/api/category",
  COMMENT_ROUTES: "/api/comments",
  IMAGES_ROUTES: "/api/images",
  IMAGES_ROUTE: "/images",
  ARTICLE: {
    GET_UNPUBLISHED_ARTICLES: "/unpublished",
    GET_ARTICLE_BY_URL: "/:newsUrl",
    GET_ARTICLES_BY_CATEGORY_URL: "/category/:categoryUrl",
    PUBLISH_ARTICLE: "/publish/:id",
    DELETE_ARTICLE: "/:id",
  },
  USER: {
    REGISTER: "/register",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESTORE_PASSWORD: "/restore-password",
    LOGOUT: "/logout",
    GET_USER: "/me",
    GET_ACCESS_TOKEN_BY_REFRESH_TOKEN: "/token",
  },
  COMMENT: {
    GET_COMMENTS_BY_ARTICLE_ID: "/article/:articleId",
    GET_UNPUBLISHED_COMMENTS: "/unpublished",
  },
  IMAGES: {
    UPLOAD: "/upload",
  },
};
