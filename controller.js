const { fetchOwnerByID, fetchEveryOwner, fetchOwnerPet } = require("./model"); //Require info from the models now

//Controller deals with the request and response mainly - Line 4/5 deals with this.
const getOwnerByID = (request, response) => {
  const { id } = request.params;
  fetchOwnerByID(id).then((owner) => {
    //FetchOwnerByID is used above as its the data retrieved from Models!
    response.status(200).send({ owner });
  });
};
/*

ORIGINAL BLOCK OF CODE FOR ABOVE COPIED OVER FROM APP.JS - Request and Response part needed only.
const { id } = request.params;
fs.readFile(`${__dirname}/data/owners/o${id}.json`).then((ownerJSON) => {
  const owner = JSON.parse(ownerJSON);
  response.status(200).send({ owner });
});
});

*/

const getEveryOwner = (request, response) => {
  fetchEveryOwner().then((allOwners) => {
    //console.log(allOwners);
    response.status(200).send(allOwners);
  });
};

/*

CODE BEFORE ITS TAKEN APART!
app.get("/owners", (request, response) => {
  fs.readdir(`${__dirname}/data/owners`).then((ownerJSON) => {
    const ownerFileArray = ownerJSON;
    const ownerDataArray = [];
    ownerFileArray.forEach((file) => {
      fs.readFile(`${__dirname}/data/owners/${file}`).then((dataJSON) => {
        ownerDataArray.push(JSON.parse(dataJSON));
        if (ownerFileArray.length === ownerDataArray.length)
          response.status(200).send({ ownerDataArray });
      });
    });
  });
});

*/

const getOwnerPet = (request, response) => {
  const { id } = request.params;
  fetchOwnerPet(id).then((petsData) => {
    response.status(200).send({ petsData });
  });
};

/*
(request, response) => {
  const { id } = request.params;
  fs.readFile(`${__dirname}/data/owners/o${id}.json`).then((ownerJSON) => {
    const owner = JSON.parse(ownerJSON);
    const ownerId = owner.id;
    console.log(ownerId);
    fs.readdir(`${__dirname}/data/pets`).then((petsFileJSON) => {
      const petFileArray = petsFileJSON;
      const petDataArray = [];
      petFileArray.forEach((file) => {
        fs.readFile(`${__dirname}/data/pets/${file}`).then((petDataJSON) => {
          petDataArray.push(JSON.parse(petDataJSON));
          if (petFileArray.length === petDataArray.length) {
            const petsData = petDataArray.filter(
              (pet) => pet.owner === ownerId
            );
            response.status(200).send({ petsData });
          }
        });
      });
    });
  });
};
*/

module.exports = { getOwnerByID, getEveryOwner, getOwnerPet }; //Export getOwnerByID as the app.js uses this function
