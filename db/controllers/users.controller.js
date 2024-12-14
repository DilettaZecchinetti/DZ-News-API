const { fetchAllUsers } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      console.log("Controller received users:", users);
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
