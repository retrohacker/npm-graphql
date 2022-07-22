function getEmailFromField(packument, field, id) {
  if (!packument || !packument.versions) {
    return undefined;
  }

  const result = new Set()
  const versions = packument.versions;

  for (const version in versions) {
    if (versions[version][field]) {
      const value = versions[version][field]
      if (Array.isArray(value)) {
        value.forEach(v => {
          if(v.email && v.name === id) {
            result.add(v.email)
          }
        });
      } else {
        if(value.email && value.name === id) {
          result.add(value.email)
        }
      }
    }
  }
  return result;
}

const PackageCollaborator = {
  alias: (parent) => parent.id,
  emails: async (parent, _, ctx) => {
    const packument = await ctx.npm.package(parent.package);
    const id = parent.id;
    const maintainers = getEmailFromField(packument, 'maintainers', id);
    const authors = getEmailFromField(packument, 'author', id);
    const npmUsers = getEmailFromField(packument, '_npmUser', id);
    const all = new Set([...maintainers, ...authors, ...npmUsers])
    return [...all];
  }
}

export default PackageCollaborator
