const fs = require("fs/promises"); //Uses fs library within models here.

const fetchOwnerByID = (id) => {
  //Create a function for fetchOwnersByID - Performs all the logic in Models
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

const fetchOwnerPet = (id) => {
  return fs
    .readFile(`${__dirname}/data/owners/o${id}.json`)
    .then((ownerJSON) => {
      const owner = JSON.parse(ownerJSON);
      const ownerId = owner.id;
      console.log(ownerId);
      return fs.readdir(`${__dirname}/data/pets`).then((petsFileJSON) => {
        const petFileArray = petsFileJSON;
        const petDataArray = [];
        petFileArray.forEach((file) => {
          return fs
            .readFile(`${__dirname}/data/pets/${file}`)
            .then((petDataJSON) => {
              petDataArray.push(JSON.parse(petDataJSON));
              if (petFileArray.length === petDataArray.length) {
                const petsData = petDataArray.filter(
                  (pet) => pet.owner === ownerId
                );
                return petsData;
              }
            });
        });
      });
    });
};

module.exports = { fetchOwnerByID, fetchEveryOwner, fetchOwnerPet }; //Export out for controller to use
