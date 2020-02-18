import config from '../config';

export default (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  }

  ctx.redirect(`${config('domain')}/login`);
};
