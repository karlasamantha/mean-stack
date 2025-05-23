import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

employeeRouter.get("/", async (_req, res) => {
    try {
        const employees = await collections?.employees?.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error);
    }
})

employeeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const employee = await collections?.employees?.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send({ error: `Employee not found: id ${id}` });
        }
    } catch (error) {
        res.status(404).send({ error: `Employee not found: id ${req?.params?.id}` });
    }
});

employeeRouter.post("/", async (req, res) => {
    try {
        const newEmployee = req.body;
        const result = await collections?.employees?.insertOne(newEmployee);

        if (result?.acknowledged) {
            res.status(201).send(`Created new employee with ID: ${result.insertedId}`)
        } else {
            res.status(500).send("Failed to create new employee");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee =  req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.employees?.updateOne(query, {
            $set: employee
        });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated employee with ID: ${id}`);
        } else if (!result?.matchedCount) {
            res.status(404).send({ error: `Employee not found: id ${id}` });
        } else {
            res.status(304).send(`Failed to update new employee with ID: ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(error)
        res.status(400).send(message);
    }
});

employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.employees?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(200).send(`Removed employee with ID: ${id}`);
        } else if (!result) {
          res.status(400).send({ error: `Failed to remove employee with id ${id}` });
        } else if (!result?.deletedCount) {
            res.status(404).send({ error: `Employee not found: id ${id}` });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(error)
        res.status(400).send(message);
    }
})
