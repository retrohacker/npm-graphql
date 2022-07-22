import semver from 'semver';
import equal from 'fast-deep-equal';

/*
function dedupe (arr) {
  return arr
    .filter((v, i, a) => {
      for(let index = 0; index < i; index++) {
        if(equal(a[index], v)) {
          return false
        }
      }
      return true
    })
}
*/

function getSortedVersions (packument) {
  if (!packument || !packument.versions) {
    return undefined;
  }
  const versions = packument.versions;
  const sortedVersions = semver.rsort(Object.keys(versions));
  const tags = packument['dist-tags'];
  if (tags && tags.latest && versions[tags.latest]) {
    return [tags.latest, ...sortedVersions];
  }
  return sortedVersions;
}

function getLatestField (packument, field) {
  const versions = getSortedVersions(packument);
  if (!versions) {
    return undefined
  }
  for (let i = 0; i < versions.length; i++) {
    const version = packument.versions[versions[i]];
    const value = version[field];
    if(value) {
      return value;
    }
  }
}

function getCollaboratorIdFromField (packument, field) {
  if (!packument || !packument.versions) {
    return undefined;
  }

  const result = new Set()
  const versions = packument.versions;

  for (const version in versions) {
    if (versions[version][field]) {
      const value = versions[version][field]
      if (Array.isArray(value)) {
        value.forEach(v => result.add(v.name));
      } else {
        result.add(value.name);
      }
    }
  }

  return result;
}

const Package = {
  name: (parent) => parent.id,
  description: async (parent, _, ctx) => {
    const packument = await ctx.npm.package(parent.id);
    return getLatestField(packument, 'description');
  },
  keywords: async (parent, _, ctx) => {
    const packument = await ctx.npm.package(parent.id);
    return getLatestField(packument, 'keywords');
  },
  /*
  collaborators: async (parent, _, ctx) => {
    const packument = await ctx.npm.package(parent.id);
    const maintainers = getCollaboratorIdFromField(packument, 'maintainers');
    const authors = getCollaboratorIdFromField(packument, 'author');
    const npmUsers = getCollaboratorIdFromField(packument, '_npmUser');
    const all = new Set([...maintainers, ...authors, ...npmUsers])
    const result = []
    for (let id of all) {
      if (id !== null) {
        result.push({ package: parent.id, id })
      }
    }
    return result
  },
  */
  versions: async (parent, { versionRange = "*" }, ctx) => {
    const packument = await ctx.npm.package(parent.id);
    return Object.keys(packument.versions || {})
      .filter(v => semver.satisfies(v, versionRange))
      .map(id => { module: parent.id, id })
  }
}

export default Package
