const fs = require("fs/promises");

const fetchOwnerByID = (id) => {
  return fs //Must return the promise
    .readFile(`${__dirname}/data/owners/o${id}.json`)
    .then((ownerJSON) => {
      const owner = JSON.parse(ownerJSON);
      return owner; //Must return the promise. This leaves it at pending state and moves it back to controller
    });
};

const fetchEveryOwner = () => {
  return fs
    .readdir("./data/owners", "UTF8")
    .then((allOwnerFiles) => {
      const arrayOfPromises = allOwnerFiles.map((ownerFile) => {
        return fs.readFile(`./data/owners/${ownerFile}`, "UTF8");
      });
      return Promise.all(arrayOfPromises); //No .then so it leaves it as pending, going into the promise.all
    })
    .then((stringifiedOwners) => {
      const parsedOwners = stringifiedOwners.map((stringifiedOwner) => {
        return JSON.parse(stringifiedOwner);
      });
      return parsedOwners;
    });
};

const fetchOwnerPet = (ownerID) => {
  return fs
    .readdir("./data/pets", "UTF8")
    .then((petFiles) => {
      const arrayOfPromises = petFiles.map((pet) => {
        return fs.readFile(`./data/pets/${pet}`, "utf8");
      });
      return Promise.all(arrayOfPromises);
    })
    .then((stringifiedPets) => {
      const parsedPets = stringifiedPets.map((pet) => {
        return JSON.parse(pet);
      });
      return parsedPets;
    })
    .then((parsedPets) => {
      const ownersPets = parsedPets.filter((pet) => {
        return ownerID === pet.owner;
      });

      return ownersPets;
    });
};

module.exports = { fetchOwnerByID, fetchEveryOwner, fetchOwnerPet }; //Export out for controller to use
