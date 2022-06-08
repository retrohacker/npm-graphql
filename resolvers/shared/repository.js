// Normalizes a repository object
function repository (repo) {
  if (!repo || repo.type !== 'git' || !repo.url) {
    return undefined;
  }
  return {
    __typename: 'PackageGitRepository',
    url: repo.url
  };
}

export default repository;
