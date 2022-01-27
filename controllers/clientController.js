const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const clientValidation = require("../validation/clientValidation.js");

const create = async (req, res) => {
  try {
    //   validate req.body
    const result = clientValidation.createValidation(req.body);
    if (result.error) return res.status(400).send(result.error.message);
    // check if email exist
    const user = await User.findOne({ email: result.value.email });
    if (user) return res.json({ message: "Email is already exist" });
    // hashing password
    const password = "12345678";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    result.value.password = hashedPassword;
    result.value.active = true;
    // create new client
    const client = new User(result.value);
    await client.save();
    if (!client) return res.status(500).send("client not created");
    return res.status(200).send("client added successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    //   validate req.body
    const result = clientValidation.updateValidation(req.body);
    if (result.error) return res.status(500).send(result.error.message);
    // update client
    const client = await User.findById(id);
    (client.firstName = result.value.firstName),
      (client.lastName = result.value.lastName),
      (client.email = result.value.email),
      (client.role = result.value.role),
      (client.active = result.value.active),
      client
        .save()
        .then(() => {
          return res.status(200).send("client updated");
        })
        .catch((err) => {
          res.status(500).send("something went wrong", err.message);
        });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

module.exports = { create, update };