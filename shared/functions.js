exports.search = (term, list) => {
  if (!term) {
    return [];
  }
  const searchResults = list.filter(listItem => {
    return listItem.name.startsWith(term);
  });
  return searchResults;
};
