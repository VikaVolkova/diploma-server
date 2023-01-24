export const getPreviewArticleDTO = (data) => ({
  _id: data._id,
  title: data.title,
  spoiler: data.spoiler,
  coverImage: data.coverImage,
  category: data.category,
  likes: data.likes,
  url: data.url,
});
