import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri)
    await client.connect();

    const db = client.db('meanStack');
    await applySchemaValidation(db)

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and it is a string",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and it is a string'",
                    minLength: 5,
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and it is one of 'junior', 'mid', 'senior',",
                    enum: ["junior", "mid", "senior"]
                }
            }
        }
    };
}