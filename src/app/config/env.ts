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
    EMAIL_SENDER: {
        SMTP_HOST: string,
        SMTP_PORT: string,
        SMTP_USER: string,
        SMTP_PASS: string,
        SMTP_FROM: string
    };
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
}

const loadEnvVars = (): IEnvConfig => {
    const requiredEnvVars: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND", "ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_PHONE", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "FRONTEND_URL", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "REDIS_HOST", "REDIS_PORT", "REDIS_USERNAME", "REDIS_PASSWORD"];

    requiredEnvVars.forEach(key => {
        if (!process.env[key]) {
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
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_FROM: process.env.SMTP_FROM as string
        },
        REDIS_HOST: process.env.REDIS_HOST as string,
        REDIS_PORT: process.env.REDIS_PORT as string,
        REDIS_USERNAME: process.env.REDIS_USERNAME as string,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD as string
    }
}

export const envVars = loadEnvVars();