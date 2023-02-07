const express = require("express");
const fs = require("fs/promises");
const { ConsoleWriter } = require("istanbul-lib-report");
const app = express();

const port = 9090;

//GET OWNERS BY ID - Respond with relevant owners data
app.get("/owners/:id", (request, response) => {
  const { id } = request.params;
  //console.log(request);
  fs.readFile(`${__dirname}/data/owners/o${id}.json`).then((ownerJSON) => {
    const owner = JSON.parse(ownerJSON);
    response.status(200).send({ owner });
  });
});

//DATA OF EVERY OWNER
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

app.get("/owners/:id/pets", (request, response) => {
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
});

app.get("/pets", (request, response) => {
  console.log(request.query);
  //get the query from the URL
  const { temperament } = request.query;
  fs.readdir(`${__dirname}/data/pets`)
    .then((petFiles) => {
      //reads each of the files within directory folder. arrPromises becomes pending promise
      const arrPromises = petFiles.map((petFile) => {
        return fs.readFile(`${__dirname}/data/pets/${petFile}`);
      });
      return Promise.all(arrPromises);
    })
    .then((petsJSONResults) => {
      const pets = petsJSONResults.map((petJSON) => {
        return JSON.parse(petJSON);
      });
      // console.log(pets); All dogs in objects
      if (temperament) {
        const filteredTemperament = pets.filter((pet) => {
          return pet.temperament === temperament;
        });
        response.status(200).send({ pet: filteredTemperament });
      } else response.status(200).send({ pets });
    });
});

//GET PETS BY ID - Respond with relevant pets data
app.get("/pets/:id", (request, response) => {
  const { id } = request.params; //console.log(request.params);  = id:1
  //read the pet directory folder
  fs.readFile(`${__dirname}/data/pets/p${id}.json`).then((petJSON) => {
    //parse the JSON file to JS objects
    const pets = JSON.parse(petJSON);
    //send the correct response
    response.status(200).send({ pets });
  });
});

//Patching an owner
//app.patch;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
