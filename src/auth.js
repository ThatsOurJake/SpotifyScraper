import passport from 'koa-passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { DateTime } from 'luxon';

import config from './config';
import { writeToSettings } from './service/data';

passport.use(
  new SpotifyStrategy(
    {
      clientID: config('auth.clientId'),
      clientSecret: config('auth.clientSecret'),
      callbackURL: `${config('domain')}/auth/callback`,
    },
    (accessToken, refreshToken, expiry, profile, done) => {
      const expiryTime = DateTime.local()
        .plus({
          seconds: expiry,
        })
        .minus({
          minutes: 1,
        })
        .valueOf();

      const { id, displayName } = profile;

      if (config('spotifyUserId') && id !== config('spotifyUserId')) {
        console.warn('Login from someone who ID is not in the env, not saving creds');
        done(null, Object.assign({}, { accessToken, id, displayName }));
        return;
      }

      writeToSettings({
        expiryTime,
        accessToken,
        refreshToken,
      });

      done(null, Object.assign({}, { accessToken, id, displayName }));
    }
  )
);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

export default app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
