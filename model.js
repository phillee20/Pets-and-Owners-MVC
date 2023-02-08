const fs = require("fs/promises");

const readOwnerById = (ownerId) => {
  return fs
    .readFile(`./data/owners/o${ownerId.id}.json`, "utf8")
    .then((ownerJSON) => {
      const ownerObj = JSON.parse(ownerJSON);
      return ownerObj;
    });
};

module.exports = { readOwnerById };
