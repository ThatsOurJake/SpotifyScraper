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
      callbackURL: config('auth.callbackUrl'),
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

      writeToSettings({
        expiryTime,
        accessToken,
        refreshToken,
      });

      const { id, displayName } = profile;
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
