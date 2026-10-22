import config from '../config.js';

export default (ctx, next) => {
  const spotifyUserId = config('spotifyUserId');

  if (spotifyUserId && ctx.state.user.id !== spotifyUserId) {
    ctx.status = 403;
    return;
  }

  return next();
};
