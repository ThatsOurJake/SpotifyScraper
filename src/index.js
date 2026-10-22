import path from 'path';

import Koa from 'koa';
import session from 'koa-session';
import KoaPug from 'koa-pug';
import KoaRouter from '@koa/router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';

import config from './config.js';
import auth from './auth.js';
import routes from './routes.js';
import crons from './cron.js';

const __dirname = import.meta.dirname;

const app = new Koa();
const router = new KoaRouter();

app.use(bodyParser());
app.keys = [config('sessionKey')];
app.use(session({}, app));

auth(app);

new KoaPug({
  viewPath: path.join(__dirname, 'views'),
  debug: true,
  app,
  locals: {
    domain: config('domain'),
  },
});

app.use(serve(path.join(__dirname, 'assets')));

router.use(routes.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config('port'), () => {
  console.log(`Listening on Port: ${config('port')}`);
});

crons();
