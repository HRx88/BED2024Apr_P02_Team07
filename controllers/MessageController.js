const Msg = require("../models/Message");

const getAllMsg = async (req, res) => {
  try {
    const Msgs = await Msg.getAllMsg();
    res.json(Msgs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Message");
  }
};

const createMsg = async (req, res) => {
  const newMsg = req.body;
  try {
    const createdMsg = await Msg.createMsg(newMsg);
    res.status(201).json(createdMsg);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Message");
  }
};

async function getUsersWithMsg(req, res) {
  try {
    const users = await Msg.getUsersWithMsg();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users with Message" });
  }
}

module.exports = {
  getAllMsg,
  createMsg,
  getUsersWithMsg,
};
