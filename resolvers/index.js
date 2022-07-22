import Package from './package.js'
import PackageCollaborator from './packageCollaborator.js'
import PackageVersion from './packageVersion.js'

export default {
  Query: {
    getPackage: (_, { name }) => ({ id: name })
  },
  Package,
  PackageCollaborator,
  PackageVersion
};
