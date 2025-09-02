/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";


// USER LOGIN ------
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged In Successfully",
        data: loginInfo
    })
})

// // CREATE ACCESSTOKEN FROM REFRESH TOKEN ------
// const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//         throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token Received");
//     }

//     const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

//     setAuthCookie(res, tokenInfo)

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "User Tokens Retrived Successfully",
//         data: tokenInfo,
//     })
// })

// USER LOGOUT ------
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged Out Successfully",
        data: null,
    })
})


export const AuthControllers = {
    credentialsLogin, logout
    // getNewAccessToken, resetPassword
}