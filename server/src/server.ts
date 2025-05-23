import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error(
        `ATLAS_URI environment variable not found!`
    );
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());

        app.use('/employees', employeeRouter);

        app.listen(5400, () => {
            console.info(`Server running on port 5400`);
        });
    })
    .catch(err => {console.error(err)})