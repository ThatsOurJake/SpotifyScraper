import { config } from 'dotenv';
import get from 'lodash.get';

config();

const cfg = {
  port: process.env.PORT || 3000,
  sessionKey: process.env.SESSION_KEY || 'session_key',
  auth: {
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
  },
  domain: process.env.DOMAIN || '//localhost:3000',
  spotifyUserId: process.env.USER_ID,
};

export default path => get(cfg, path);
