import express, { Application, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";


const app: Application = express();


app.use(express.json());
app.use(cors());
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery System Backend"
    });
})


export default app;