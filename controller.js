const { fetchOwnerByID, fetchEveryOwner } = require("./model"); //Require info from the models now

//Controller deals with the request and reponse mainly - Line 4/5 deals with this.
const getOwnerByID = (request, response) => {
  const { id } = request.params;
  fetchOwnerByID(id).then((owner) => {
    //FetchOwnerByID is used here as its the data retrieved from Models!
    response.status(200).send({ owner });
  });
};
/*

ORIGINAL BLOCK OF CODE FOR ABOVE COPIED OVER FROM APP.JS
const { id } = request.params;
fs.readFile(`${__dirname}/data/owners/o${id}.json`).then((ownerJSON) => {
  const owner = JSON.parse(ownerJSON);
  response.status(200).send({ owner });
});
});

*/

const getEveryOwner = (request, response) => {
  fetchEveryOwner().then((ownerDataArray) => {
    response.status(200).send(ownerDataArray);
  });
};

module.exports = { getOwnerByID, getEveryOwner }; //Export getOwnerByID as the app.js uses this function
