const express = require("express");
const fs = require("fs/promises");
const app = express();
app.use(express.json());

const port = 3000;

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

//GET PETS FOR THE RELEVANT OWNER
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

/*
//Patching/Updating an Owners data
app.patch("/data/owners/:id", (request, response) => {
  const id = request.params.id;
  const updatedBody = request.body;
  fs.writeFile(
    `${__dirname}/data/owners/o${id}.json`,
    JSON.stringify(updatedBody, null, 2)
  ).then(() => {
    response.status(200).send({ file: updatedBody });
  });
});
*/

//Patching/Updating an Owners data
app.patch("/data/owners/:id", (request, response) => {
  const { id } = request.params;
  const usersUpdateData = request.body;
  fs.readFile(`${__dirname}/data/owners/o${id}.json`, "utf-8")
    .then((owner) => {
      const ownerObj = JSON.parse(owner);
      if (usersUpdateData.name) {
        ownerObj.name = usersUpdateData.name;
      }
      if (usersUpdateData.age) {
        ownerObj.age = usersUpdateData.age;
      }
      const writeFilePromise = fs.writeFile(
        `${__dirname}/data/owners/o${id}.json`,
        JSON.stringify(ownerObj)
      );
      console.log(ownerObj);
      return Promise.all([ownerObj, writeFilePromise]);
    })
    .then((promiseArr) => {
      const updatedData = promiseArr[0];
      response.status(201).send(updatedData);
    });
});

//POST A NEW OWNER!
app.post("/data/owners", (request, response) => {
  const newPerson = {
    id: `o${Date.now()}`,
    name: request.body.name,
    age: request.body.age,
  };
  fs.writeFile(
    `${__dirname}/data/owners/${newPerson.id}.json`,
    JSON.stringify(newPerson, null, 2)
  ).then(() => {
    response.status(201).send({ newPerson });
  });
});

//POST PET TO AN OWNER
app.post("/data/owners/:id/pets", (request, response) => {
  const id = request.params.id;
  fs.readdir(`${__dirname}/data/owners`).then((fileNames) => {
    const checkIdfile = `${id}.json`;
    console.log(checkIdfile);
    console.log(fileNames);
    if (fileNames.includes(checkIdfile)) {
      const newPet = {
        id: `p${Date.now()}`,
        name: request.body.name,
        avatarUrl: request.body.avatarUrl,
      };
      fs.writeFile(
        `${__dirname}/data/pets/${newPet.id}.json`,
        JSON.stringify(newPet, null, 2)
      ).then(() => {
        response.status(201).send({ newPet });
      });
    }
  });
});

//DELETE PETS
app.delete(`/data/pets/:id`, (request, response) => {
  const petId = request.params.id;
  console.log(request.params.id);
  fs.readdir(`${__dirname}/data/pets`).then((results) => {
    const petToRemovePath = `${petId}.json`;
    if (results.includes(petToRemovePath)) {
      fs.unlink(`${__dirname}/data/pets/${petToRemovePath}`).then(
        (response) => {
          response.status(200).send(`Pet ${petId} deleted`);
        }
      );
    } else response.status(404).send(`Pet ${petId} not found`);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
