import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import AppError from "../errorHelpers/appError";
import { UserStatus } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "No Token Received");
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User Email Does Not Exist");
        }

        if (!isUserExist.isVerified) {
            throw new AppError(httpStatus.BAD_REQUEST, "User Is Not Verified");
        }

        if (isUserExist.userStatus === UserStatus.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, `User Is ${isUserExist.userStatus}`);
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.BAD_REQUEST, "You're Not Allowed To Do This Action");
        }

        req.user = verifiedToken;
        next()
    } catch (err) {
        next(err)
    }
}