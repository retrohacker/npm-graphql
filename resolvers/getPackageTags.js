import getPackageVersions from './getPackageVersions.js';

function getPackageTags (parent, args) {
  const tag = args.tag;
  if (!parent || !parent.packument || !parent.packument.json || !parent.packument.json['dist-tags']) {
    return undefined;
  }
  const distTags = parent.packument.json['dist-tags'];
  const tags = Object.keys(distTags)
    .map(v => ({
      name: v,
      version: getPackageVersions(parent, { semver: distTags[v] })[0]
    }));
  console.log(tags[0]);
  if (tag) {
    return tags.filter(v => v.name === tag);
  }
  return tags;
}

export default getPackageTags;
