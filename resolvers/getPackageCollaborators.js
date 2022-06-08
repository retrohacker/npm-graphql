import parsePackument from './shared/packument.js';

function collaborators (parent) {
  const packument = parent.packument;
  if (!packument || !packument.json || !packument.json.versions) {
    return undefined;
  }
  const maintainers = parsePackument.getAllFields(packument, 'maintainers');
  const authors = parsePackument.getAllFields(packument, 'author');
  const npmUsers = parsePackument.getAllFields(packument, '_npmUser');
  const users = [].concat(maintainers, authors, npmUsers)
    .reduce((a, v) => a.concat(v), []);
  return parsePackument.dedupe(users).map(v => ({
    alias: v.name,
    email: v.email
  }));
}

export default collaborators;
