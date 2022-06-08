import getPackage from './getPackage.js';
import getPackageCollaborators from './getPackageCollaborators.js';
import getPackageRepositories from './getPackageRepositories.js';
import getPackageVersions from './getPackageVersions.js';
import getPackageTags from './getPackageTags.js';

export default {
  Query: {
    getPackage: getPackage
  },
  Package: {
    collaborators: getPackageCollaborators,
    repositories: getPackageRepositories,
    versions: getPackageVersions,
    tags: getPackageTags
  }
};
