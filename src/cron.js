import { schedule } from 'node-cron';

import { getRecent } from './service/spotify';
import { getSettings } from './service/data';
import { hasExpired, refreshCurrentToken } from './service/token';

const getToken = () => {
  const { accessToken } = getSettings();
  return accessToken;
};

const getTracks = async () => {
  if (!getToken()) {
    console.error('Please login to the site first at /login');
    return;
  }

  if (hasExpired()) {
    await refreshCurrentToken(getToken());
  }

  console.log('Getting latest tracks');
  await getRecent(getToken());
};

export default () => {
  schedule('0 0,1,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * *', () => {
    getTracks();
  });
};
