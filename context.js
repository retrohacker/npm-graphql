import { request } from 'undici'
const REGISTRY_URL = "https://registry.npmjs.com"

import suCache from 'single-user-cache';
import TTLCache from '@isaacs/ttlcache';

let packageCache = new TTLCache({
  max: 100000,
  ttl: 60 * 1000,
});

const requestCache = new suCache.Factory();

async function getPackage(name) {

  if (packageCache.has(name)) {
    return packageCache.get(name)
  }

  const {
    statusCode,
    body
  } = await request(`${REGISTRY_URL}/${name}`)

  if (statusCode !== 200) {
    throw Error('Failed to fetch packument')
  }

  const result = await body.json()
  packageCache.set(name, result)

  return result
}

requestCache.add('package', async (queries) => {
  return queries.map(name => getPackage(name))
});

function getContext() {
  return {
    npm: requestCache.create()
  }
}

export default getContext
