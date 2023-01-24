const filtering = (input, filterCriteria) => {
  if (input != []) {
    found =
      filterCriteria != undefined
        ? input.map((key) => {
            if (
              JSON.parse(key.filterCriteria) !== [] &&
              JSON.parse(key.filterCriteria) !== null
            ) {
              if (
                JSON.parse(key.filterCriteria).some(
                  (item) => filterCriteria.indexOf(item) >= 0
                )
              ) {
                return key;
              }
            }
          })
        : input;
  }
  found = found.filter(function (element) {
    return element !== undefined;
  });

  return found;
};
