import follow from 'follow';
import fs from 'fs/promises';
import { promisify } from 'util';
import Registry from 'npm-change-resolve';
import { queue } from 'async';

const registry = new Registry();

const follower = async () => {
  let seq = 0;

  try {
    seq = Number(await fs.readFile('./state/seq.txt'));
  } catch (e) {
    if (e.code === 'ENOENT') {
      await fs.writeFile('./state/seq.txt', String(seq), 'utf8');
    }
  }

  // Start a loop that syncs the sequence id to the filesystem
  (async () => {
    while (true) {
      // Atomically write the file
      await fs.writeFile('./state/seq.bak', String(seq), 'utf8');
      await fs.unlink('./state/seq.txt');
      await fs.link('./state/seq.bak', './state/seq.txt');
      await fs.unlink('./state/seq.bak');
      await promisify(setTimeout)(1000);
    }
  })();

  const resolve = queue((task, cb) => {
    registry.get(task.id, (e, change) => {
      if (e && e.statusCode !== 404) {
        console.error(e);
        resolve.push(task);
      }
      if (change === undefined || change.versions.length === 0) {
        seq = task.seq;
        return cb();
      }
      (async () => {
        const filename = encodeURIComponent(task.id);
        await fs.writeFile(`./state/registry/${filename}.json`, JSON.stringify(change), 'utf8');
        seq = task.seq;
        console.log(task.id);
        return cb();
      })();
    });
  });

  follow({
    db: 'https://replicate.npmjs.com/registry',
    since: seq,
    inactivity_ms: 3600000
  }, (e, pkg) => {
    resolve.push(pkg);
  });
};

follower();