import KoaRouter from 'koa-router';
import passport from 'koa-passport';

import isAuthed from './middleware/isAuthed';
import { getTracksBetweenDates } from './service/data';

const router = new KoaRouter();

router.get('/', isAuthed, async ctx => {
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
    successRedirect: './',
    failureRedirect: './login',
  })
);

router.post('/tracks', isAuthed, async ctx => {
  const { start_date: startDate, end_date: endDate } = ctx.query;
  ctx.body = await getTracksBetweenDates(startDate, endDate);
  ctx.attachment('tracks.json');
});

export default router;
