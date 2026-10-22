import { DateTime } from 'luxon';

import config from '../config.js';

import { getSettings, writeToSettings } from './data.js';

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
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    save(data);
  } catch (error) {
    console.error(error);
  }
};

export const hasExpired = () => {
  const { expiryTime } = getSettings();

  return DateTime.local() > DateTime.fromMillis(expiryTime);
};
