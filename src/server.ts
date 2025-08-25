/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedAdmin } from "./app/utils/seedAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);

        console.log("Connected To MongoDB");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is Listening To Port ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

(async() => {
    await startServer();
    await seedAdmin();
    await connectRedis();
})()

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection Detected... Server Shutting Down. ", err);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Detected... Server Shutting Down. ", err);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on("SIGTERM", () => {
    console.log("SIGTERM Signal Received... Server Shutting Down. ");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})