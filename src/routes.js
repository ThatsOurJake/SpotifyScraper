import KoaRouter from 'koa-router';
import passport from 'koa-passport';
import { config } from 'dotenv';

import isAuthed from './middleware/isAuthed';
import userLockDown from './middleware/userLockDown';
import { getTracksBetweenDates } from './service/data';

const router = new KoaRouter();

router.get('/', isAuthed, userLockDown, async ctx => {
  ctx.render('index');
});

router.get(
  '/login',
  passport.authenticate('spotify', {
    scope: ['user-read-recently-played'],
    showDialog: true,
  })
);

router.get(
  '/auth/callback',
  passport.authenticate('spotify', {
    successRedirect: `${config('domain')}`,
    failureRedirect: `${config('domain')}/login`,
  })
);

router.post('/tracks', isAuthed, userLockDown, async ctx => {
  const { start_date: startDate, end_date: endDate } = ctx.query;
  ctx.body = await getTracksBetweenDates(startDate, endDate);
  ctx.attachment('tracks.json');
});

export default router;
