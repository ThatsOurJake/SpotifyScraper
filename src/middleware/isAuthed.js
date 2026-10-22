import config from '../config.js';

export default (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  }

  ctx.redirect(`${config('domain')}/login`);
};
