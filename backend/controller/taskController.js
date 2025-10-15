import csv from "csv-parser";
import fs from "fs";
import Task from "../models/Task.js";
import Agent from "../models/Agent.js";

export const uploadTasks = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "File required" });

  let tasks = [];
  fs.createReadStream(file.path)
    .pipe(csv())
    .on("data", (row) => {
      tasks.push(row);
    })
    .on("end", async () => {
      const agents = await Agent.find();
      if (agents.length < 5)
        return res.status(400).json({ message: "Need at least 5 agents" });

      // Distribute tasks
      const distributed = tasks.map((task, index) => {
        task.assignedTo = agents[index % 5]._id;
        return task;
      });

      await Task.insertMany(distributed);
      fs.unlinkSync(file.path); // remove temp file
      res.json({ message: "Tasks distributed successfully" });
    });
};
