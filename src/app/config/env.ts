import dotenv from "dotenv";

dotenv.config();

// INTERFACE DECLARATION FOR ENVCONFIG
interface IEnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "Development" | "Production",
    BCRYPT_SALT_ROUND: string,
    ADMIN_EMAIL: string,
    ADMIN_PASSWORD: string,
    ADMIN_PHONE: string,
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES: string,
    FRONTEND_URL: string,
}

const loadEnvVars = () : IEnvConfig => {
    const requiredEnvVars: string [] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND", "ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_PHONE", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "FRONTEND_URL"];

    requiredEnvVars.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing Required Environment Variable ${key}`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        ADMIN_PHONE: process.env.ADMIN_PHONE as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string
    }
}

export const envVars = loadEnvVars();