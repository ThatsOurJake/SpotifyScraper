import path from 'path';
import fs from 'fs';

import Datastore from 'nedb';
import { DateTime } from 'luxon';

const tracksDb = new Datastore({
  autoload: true,
  filename: path.join(__dirname, '..', '..', 'data', 'tracks.db'),
});

const loc = path.join(__dirname, '..', '..', 'data', 'data.json');

export const getSettings = () => {
  if (!fs.existsSync(loc)) {
    fs.writeFileSync(loc, JSON.stringify({}));
  }

  return JSON.parse(fs.readFileSync(loc));
};

export const writeToSettings = obj => {
  const settings = getSettings();
  const newSettings = Object.assign(settings, obj);
  fs.writeFileSync(loc, JSON.stringify(newSettings));
};

export const writeItemsToDb = items => {
  const tracks = items.map(({ track, played_at: playedAt }) => {
    return {
      id: track.id,
      name: track.name,
      playedAt: DateTime.fromISO(playedAt).valueOf(),
    };
  });

  return new Promise((resolve, reject) => {
    tracksDb.insert(tracks, error => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
};
