import Fastify from 'fastify';
import mercurius from 'mercurius';
import fs from 'fs/promises';
import path from 'path';
import { globby } from 'globby';
import resolvers from './resolvers/index.js';

const app = Fastify();

async function loadSchema () {
  const files = await globby(path.join('schema', '*.graphql'));
  const loadSchema = files.map(file => fs.readFile(file, 'utf8'));
  return await Promise.all(loadSchema);
}

async function main () {
  const schema = await loadSchema();
  app.register(mercurius, {
    schema, resolvers, graphiql: true
  });
  app.listen(3000);
}

main();
