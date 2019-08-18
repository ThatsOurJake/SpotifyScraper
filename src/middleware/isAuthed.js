export default (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  }

  ctx.redirect('./login');
};
