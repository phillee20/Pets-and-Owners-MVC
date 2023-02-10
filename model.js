const fs = require("fs/promises"); //Uses fs library within models here.

const fetchOwnerByID = (id) => {
  //Create a function for fetchOwnersByID - Performs all the logic here
  return fs //Must return the promise
    .readFile(`${__dirname}/data/owners/o${id}.json`)
    .then((ownerJSON) => {
      const owner = JSON.parse(ownerJSON);
      return owner; //Must return the promise. This leaves it at pending state and moves it back to controller
    });
};

const fetchEveryOwner = () => {
  return fs.readdir(`${__dirname}/data/owners`).then((ownerJSON) => {
    const ownerFileArray = ownerJSON;
    const ownerDataArray = [];
    ownerFileArray.forEach((file) => {
      return fs
        .readFile(`${__dirname}/data/owners/${file}`)
        .then((dataJSON) => {
          ownerDataArray.push(JSON.parse(dataJSON));
          if (ownerFileArray.length === ownerDataArray.length)
            //console.log(ownerDataArray);
            return ownerDataArray;
        });
    });
  });
};

module.exports = { fetchOwnerByID, fetchEveryOwner }; //Export out for controller to use
