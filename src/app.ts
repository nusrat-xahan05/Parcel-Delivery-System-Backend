import express, { Application, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";
import cookieParser from "cookie-parser";


const app: Application = express();


app.use(cookieParser());
app.use(express.json());
// app.use(cors({
//     origin: envVars.FRONTEND_URL,
//     credentials: true
// }))

const allowedOrigins = envVars.FRONTEND_URL.split(",");
// console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // eslint-disable-next-line no-console
      console.log("Requested origins:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery System Backend"
    });
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;