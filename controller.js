const { readOwnerById } = require("./model");

const fetchOwnerById = (request, response) => {
  const ownerId = request.params;

  readOwnerById(ownerId).then((ownerObj) => {
    response.status(200).send({ owner: ownerObj });
  });
};

module.exports = { fetchOwnerById };
