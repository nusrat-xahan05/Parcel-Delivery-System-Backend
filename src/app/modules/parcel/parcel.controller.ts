/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { ParcelServices } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";


// CREATE PARCEL ------
const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const parcel = await ParcelServices.createParcel(req.body, decodedToken)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Parcel Created Successfully",
        data: parcel,
    })
})

// GET MY PARCELS ------
const getMyParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const result = await ParcelServices.getMyParcels(decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your Parcels Retrieved Successfully",
        data: result.data
    })
})

// GET ALL PARCELS ------
const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await ParcelServices.getAllParcels(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Parcels Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

// GET INCOMING PARCELS ------
const getIncomingParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const result = await ParcelServices.getIncomingParcels(decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your Parcels Retrieved Successfully",
        data: result.data
    })
})

// GET DELIVERY HISTORY ------
const viewHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const result = await ParcelServices.viewHistory(decodedToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Parcels Delivered History Retrived Successfully",
        data: result.data
    })
})

// GET SINGLE PARCEL ------
const getSingleParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const result = await ParcelServices.getSingleParcel(parcelId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Retrieved Successfully",
        data: result.data
    })
})

// UPDATE PARCEL ------
const manageParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const decodedToken = req.user;
    const result = await ParcelServices.manageParcel(parcelId, req.body, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Updated Successfully",
        data: result.data
    })
})

// UPDATE PARCEL-STATUS ------
const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const decodedToken = req.user;
    const result = await ParcelServices.updateParcelStatus(parcelId, req.body, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Status Updated Successfully",
        data: result.data
    })
})

// CENCEL PARCEL ------
const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const decodedToken = req.user;
    const result = await ParcelServices.cancelParcel(parcelId, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your Parcel Cancelled Successfully",
        data: result.data
    })
})

// CONFIRM PARCEL DELIVERY ------
const confirmDelivery = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const decodedToken = req.user;
    const result = await ParcelServices.confirmDelivery(id, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Is RECEIVED Successfully",
        data: result.data
    })
})

// TRACK THE PARCEL ------
const trackParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const trackingId = req.params.id;
    const result = await ParcelServices.trackParcel(trackingId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Tracking History Retrived Successfully",
        data: result.data
    })
})

export const ParcelControllers = {
    createParcel, getAllParcels, viewHistory, getMyParcels, getIncomingParcels, getSingleParcel, manageParcel, updateParcelStatus, cancelParcel, confirmDelivery, trackParcel
}