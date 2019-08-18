import querystring from 'querystring';

import { DateTime } from 'luxon';
import axios from 'axios';

import config from '../config';

import { getSettings, writeToSettings } from './data';

const save = ({ expires_in: expiry, access_token: accessToken }) => {
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
  });
};

export const refreshCurrentToken = async () => {
  const { clientId, clientSecret } = config('auth');
  const { refreshToken } = getSettings();

  try {
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    save(data);
  } catch (error) {
    console.error(error.response.data);
  }
};

export const hasExpired = () => {
  const { expiryTime } = getSettings();

  return DateTime.local() > DateTime.fromMillis(expiryTime);
};
