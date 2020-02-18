import config from '../config';

export default (ctx, next) => {
  if (config('spotifyUserId' && ctx.state.user.id !== config('spotifyUserId'))) {
    ctx.status = 403;
    return;
  }

  return next();
};
