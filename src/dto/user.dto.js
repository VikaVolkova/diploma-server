export const getUserDTO = (data) => ({
  _id: data._id,
  name: data.name,
  email: data.email,
  image: data.image,
  role: data.role,
  isBlocked: data.isBlocked,
  googleUser: data.googleUser,
});
