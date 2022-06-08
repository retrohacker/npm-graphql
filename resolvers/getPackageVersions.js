import semver from 'semver';
import parseRepository from './shared/repository.js';

function description (version) {
  return version && version.description;
}

function version (version) {
  return version && version.version;
}

function download (version) {
  return {
    shasum: version && version.dist && version.dist.shasum,
    tarball: version && version.dist && version.dist.tarball
  };
}

function npmUser (version) {
  return {
    username: version && version._npmUser && version._npmUser.name,
    email: version && version._npmUser && version._npmUser.email
  };
}

function repository (version) {
  return version && version.repository && parseRepository(version.repository);
}

function packageVersions (parent, args) {
  const semverRange = args.semver || '*';
  const packument = parent.packument;
  if (!packument || !packument.json || !packument.json.versions) {
    return undefined;
  }
  const versions = Object.keys(packument.json.versions)
    .filter(v => semver.satisfies(v, semverRange))
    .map(v => packument.json.versions[v])
    .map(v => ({
      version: version(v),
      description: description(v),
      download: download(v),
      npmUser: npmUser(v),
      repository: repository(v)
    }));
  return versions;
}
export default packageVersions;
