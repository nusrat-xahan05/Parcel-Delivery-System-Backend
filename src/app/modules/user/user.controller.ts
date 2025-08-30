/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


// USER REGISTRATION ------
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created Successfully",
        data: user,
    })
})

// USER AGENT REQUEST ------
const createAgentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const user = await UserServices.createAgentRequest(decodedToken.email)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Request To Be An Agent Created Successfully",
        data: user,
    })
})

// GET CURRENT USER ------ 
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})

// GET ALL USERS ------ 
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.getAllUsers(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

// GET ALL AGENT REQUEST ------
const GetAllAgentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.GetAllAgentRequest(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Agent Request Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

// USER PROFILE UPDATE, BLOCK & Verification CAN BE DONE BY ADMIN ------
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, decodedToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Updated Successfully",
        data: user,
    })
})

// REVIEW AGENT REQUEST ------
const reviewAgentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id;
    const decodedToken = req.user;
    const user = await UserServices.reviewAgentRequest(requestId, req.body, decodedToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Agent Request Reviewed Successfully",
        data: user,
    })
})


export const UserControllers = {
    createUser, createAgentRequest, getMe, getAllUsers, GetAllAgentRequest, getSingleUser, updateUser, reviewAgentRequest
}