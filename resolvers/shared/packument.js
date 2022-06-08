// Given a field name, fetch every occruence of it across all versions
// and return them as an array
function getAllFields (packument, field) {
  if (!packument || !packument.json || !packument.json.versions) {
    return undefined;
  }
  const result = [];
  const versions = packument.json.versions;
  for (const version in versions) {
    if (versions[version][field]) {
      result.push(versions[version][field]);
    }
  }
  return result;
}

// Given an array of objects - deduplicate them
function dedupe (arr) {
  return arr
    .map(v => JSON.stringify(v))
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(v => JSON.parse(v));
}

export default {
  getAllFields,
  dedupe
};
