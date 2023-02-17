const { fetchOwnerByID, fetchEveryOwner, fetchOwnerPet } = require("./model"); //Require info from the models now

const getOwnerByID = (request, response) => {
  const { id } = request.params;
  fetchOwnerByID(id).then((owner) => {
    response.status(200).send({ owner });
  });
};

const getEveryOwner = (request, response) => {
  fetchEveryOwner().then((allOwners) => {
    response.status(200).send(allOwners);
  });
};

const getOwnerPet = (request, response) => {
  const ownerID = request.params;
  console.log(request.params);
  fetchOwnerPet(ownerID).then((allOwnerPets) => {
    response.status(200).send({ allOwnerPets });
  });
};

module.exports = { getOwnerByID, getEveryOwner, getOwnerPet }; //Export getOwnerByID as the app.js uses this function
