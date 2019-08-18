import axios from 'axios';

import { writeToSettings, getSettings, writeItemsToDb } from './data';

const getTracks = async (url, token) => {
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { cursors, items } = data;

  if (!cursors || !cursors.after) {
    console.log('No new songs to save');
    return null;
  }

  return {
    tracks: items,
    after: cursors.after,
  };
};

const getUrl = () => {
  const settings = getSettings();

  if (settings && settings.after) {
    return `https://api.spotify.com/v1/me/player/recently-played?type=track&limit=50&after=${settings.after}`;
  }

  return 'https://api.spotify.com/v1/me/player/recently-played?type=track&limit=50';
};

export const getRecent = async token => {
  try {
    const results = await getTracks(getUrl(), token);

    if (!results) {
      return;
    }

    const { tracks, after } = results;

    writeToSettings({
      after,
    });

    await writeItemsToDb(tracks);
    console.log('Saved tracks to db');
  } catch (error) {
    console.log(error);
  }
};
