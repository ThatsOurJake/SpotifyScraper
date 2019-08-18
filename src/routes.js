import KoaRouter from 'koa-router';
import passport from 'koa-passport';

import isAuthed from './middleware/isAuthed';

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

export default router;
