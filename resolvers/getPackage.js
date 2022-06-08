import fs from 'fs/promises';
import path from 'path';
import semver from 'semver';

function parseName (packument) {
  return packument && packument.json && packument.json.name;
}

// Return the list of versions sorted by semver. If there is a latest
// dist-tag on the package that is included first.
function sortVersions (packument) {
  if (!packument || !packument.json || !packument.json.versions) {
    return undefined;
  }
  const versions = packument.json.versions;
  const sortedVersions = semver.rsort(Object.keys(versions));
  const tags = packument.json['dist-tags'];
  if (tags && tags.latest && versions[tags.latest]) {
    return [tags.latest, ...sortedVersions];
  }
  return sortedVersions;
}

// Fetch the latest version of the description and keywords
// fields if defined
function getLatestFields (packument) {
  const result = {
    description: undefined,
    keywords: undefined
  };
  const versions = sortVersions(packument);
  if (!versions) {
    return result;
  }
  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    const description = packument.json.versions[version] && packument.json.versions[version].description;
    const keywords = packument.json.versions[version] && packument.json.versions[version].keywords;
    if (description) {
      result.description = result.description || description;
    }
    if (keywords) {
      result.keywords = result.keywords || keywords;
    }
    if (result.keywords && result.description) {
      break;
    }
  }
  return result;
}

const getPackage = async (obj, args) => {
  const name = encodeURIComponent(args.name);
  let packument;
  try {
    packument = JSON.parse(await fs.readFile(path.join('state', 'registry', `${name}.json`), 'utf8'));
  } catch (e) {
    return {
      __typename: 'ExpectedError',
      code: 'ENOENT',
      message: `Could not find package ${args.name}`
    };
  }
  return {
    __typename: 'Package',
    name: parseName(packument),
    ...getLatestFields(packument),
    packument
  };
};

export default getPackage;
