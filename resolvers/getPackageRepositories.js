import parsePackument from './shared/packument.js';
import parseRepository from './shared/repository.js';

function collaborators (parent) {
  const packument = parent.packument;
  if (!packument || !packument.json || !packument.json.versions) {
    return undefined;
  }
  const repositories = parsePackument.getAllFields(packument, 'repository')
    .map(v => parseRepository(v))
    .filter(v => v !== undefined);
  return parsePackument.dedupe(repositories);
}

export default collaborators;
