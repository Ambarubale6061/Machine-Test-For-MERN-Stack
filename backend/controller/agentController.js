import Agent from "../models/Agent.js";

export const addAgent = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const agent = await Agent.create({ name, email, phone, password });
  res.status(201).json(agent);
};

export const getAgents = async (req, res) => {
  const agents = await Agent.find();
  res.json(agents);
};
