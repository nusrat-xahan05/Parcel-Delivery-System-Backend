import { JwtPayload } from "jsonwebtoken";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { QueryBuilder } from "../../utils/queryBuilder";
import { parcelSearchableFields } from "./parcel.constant";


// CREATE PARCEL ------
const createParcel = async (payload: Partial<IParcel>, decodedToken: JwtPayload) => {
    const trackingId = await generateTrackingId();

    const parcel = await Parcel.create({
        ...payload,
        senderEmail: decodedToken.email,
        senderId: decodedToken.userId,
        trackingId,
        currentStatus: ParcelStatus.REQUESTED,
        parcelStatusLog: [{
            status: ParcelStatus.REQUESTED,
            updatedBy: decodedToken.role,
            updaterId: decodedToken.userId
        }]
    });
    return parcel;
}

// GET MY PARCELS ------
const getMyParcels = async (decodedToken: JwtPayload) => {
    const parcels = await Parcel.find({ senderId: decodedToken.userId });

    return {
        data: parcels
    }
};

// GET ALL PARCELS ------
const getAllParcels = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Parcel.find(), query)
    const parcelsData = queryBuilder
        .filter()
        .search(parcelSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        parcelsData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

// GET ASSIGNED PARCELS ------ (AGENT ENDPOINT)
const getAssignedParcels = async (decodedToken: JwtPayload, query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Parcel.find({ agentId: decodedToken.userId }), query)
    const parcelsData = queryBuilder
        .filter()
        .search(parcelSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        parcelsData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

// GET INCOMING PARCELS ------
const getIncomingParcels = async (decodedToken: JwtPayload) => {
    const parcels = await Parcel.find({
        receiverEmail: decodedToken.email,
        currentStatus: { $nin: ["REQUESTED", "CANCELLED", "BLOCKED", "CONFIRMED"] }
    });

    return {
        data: parcels
    }
};

// GET DELIVERY HISTORY ------
const viewHistory = async (decodedToken: JwtPayload) => {
    const parcels = await Parcel.find({ receiverEmail: decodedToken.email, currentStatus: ParcelStatus.CONFIRMED });

    return {
        data: parcels
    };
}

// GET SINGLE PARCEL ------
const getSingleParcel = async (parcelId: string) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    return {
        data: isParcelExist
    }
};

// UPDATE PARCEL ------
const manageParcel = async (parcelId: string, payload: Partial<IParcel>, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    if (payload.currentStatus) {
        if (payload.currentStatus === isParcelExist.currentStatus) {
            throw new AppError(httpStatus.BAD_REQUEST, `Parcel is Already ${isParcelExist.currentStatus}`);
        }
        else if ((payload.currentStatus === ParcelStatus.BLOCKED) && ((isParcelExist.currentStatus === ParcelStatus.REQUESTED) || (isParcelExist.currentStatus === ParcelStatus.APPROVED) || (isParcelExist.currentStatus === ParcelStatus.DISPATCHED))) {
            isParcelExist.currentStatus = ParcelStatus.BLOCKED;
        }
        else if ((payload.currentStatus === ParcelStatus.APPROVED) && ((isParcelExist.currentStatus === ParcelStatus.REQUESTED) || (isParcelExist.currentStatus === ParcelStatus.BLOCKED))) {
            const isUserExist = await User.findById(payload.agentId);
            if ((!isUserExist) || (isUserExist.role !== Role.AGENT)) {
                throw new AppError(httpStatus.BAD_REQUEST, "No Agent Exist With This Agent Id");
            }

            isParcelExist.currentStatus = ParcelStatus.APPROVED;
            isParcelExist.agentId = payload.agentId;
        }
        else if ((payload.currentStatus === ParcelStatus.CANCELLED) && ((isParcelExist.currentStatus === ParcelStatus.REQUESTED) || (isParcelExist.currentStatus === ParcelStatus.APPROVED))) {
            isParcelExist.currentStatus = ParcelStatus.CANCELLED;
        }
        else if (((payload.currentStatus === ParcelStatus.DISPATCHED) && (isParcelExist.currentStatus === ParcelStatus.APPROVED)) || ((payload.currentStatus === ParcelStatus.IN_TRANSIT) && (isParcelExist.currentStatus === ParcelStatus.DISPATCHED)) || ((payload.currentStatus === ParcelStatus.OUT_FOR_DELIVERY) && (isParcelExist.currentStatus === ParcelStatus.IN_TRANSIT)) || ((payload.currentStatus === ParcelStatus.DELIVERED) && (isParcelExist.currentStatus === ParcelStatus.OUT_FOR_DELIVERY))) {
            isParcelExist.currentStatus = payload.currentStatus;
        }
        else {
            throw new AppError(httpStatus.BAD_REQUEST, `Cannot ${payload.currentStatus}. Parcel is Already ${isParcelExist.currentStatus}`);
        }
        isParcelExist.parcelStatusLog.push({
            status: isParcelExist.currentStatus,
            updatedBy: decodedToken.role,
            updaterId: decodedToken.userId,
        })
    }
    await isParcelExist.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { agentId, currentStatus, ...rest } = payload;
    const parcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
            agentId: isParcelExist.agentId,
            currentStatus: isParcelExist.currentStatus,
            ...rest
        },
        { new: true, runValidators: true });

    return {
        data: parcel
    }
};

// UPDATE PARCEL-STATUS ------
const updateParcelStatus = async (parcelId: string, payload: Partial<IParcel>, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);

    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    if ((!isParcelExist.agentId) || (isParcelExist.agentId.toString() !== decodedToken.userId)) {
        throw new AppError(httpStatus.BAD_REQUEST, "You're Not Assigned For This Parcel");
    }

    if (payload.currentStatus === isParcelExist.currentStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, `Cannot ${payload.currentStatus}. Parcel is Already ${isParcelExist.currentStatus}`);
    }

    if (payload.currentStatus) {
        if ((payload.currentStatus === ParcelStatus.DISPATCHED)
            ||
            ((payload.currentStatus === ParcelStatus.IN_TRANSIT) && (isParcelExist.currentStatus === ParcelStatus.DISPATCHED))
            ||
            ((payload.currentStatus === ParcelStatus.OUT_FOR_DELIVERY) && (isParcelExist.currentStatus === ParcelStatus.IN_TRANSIT))
            ||
            ((payload.currentStatus === ParcelStatus.DELIVERED) && (isParcelExist.currentStatus === ParcelStatus.OUT_FOR_DELIVERY))) {
            isParcelExist.currentStatus = payload.currentStatus;
            isParcelExist.parcelStatusLog.push({
                status: isParcelExist.currentStatus,
                updatedBy: decodedToken.role,
                updaterId: decodedToken.userId
            })
        }
        else {
            throw new AppError(httpStatus.BAD_REQUEST, `Cannot ${payload.currentStatus}. Parcel is Just ${isParcelExist.currentStatus}`);
        }
    }
    await isParcelExist.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentStatus, ...rest } = payload;
    const parcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
            currentStatus: isParcelExist.currentStatus,
            ...rest
        },
        { new: true, runValidators: true });

    return {
        data: parcel
    }

};

// CANCEL PARCEL ------
const cancelParcel = async (parcelId: string, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    if ((isParcelExist.currentStatus !== ParcelStatus.REQUESTED) && (isParcelExist.currentStatus !== ParcelStatus.APPROVED)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Sorry, You Can't Cancel a ${isParcelExist.currentStatus} Parcel`);
    }

    isParcelExist.currentStatus = ParcelStatus.CANCELLED;
    isParcelExist.parcelStatusLog.push({
        status: ParcelStatus.CANCELLED,
        updatedBy: decodedToken.role,
        updaterId: decodedToken.userId
    })
    await isParcelExist.save();

    return {
        data: isParcelExist
    }
};

// CONFIRM PARCEL DELIVERY ------
const confirmDelivery = async (parcelId: string, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    if (isParcelExist.currentStatus !== ParcelStatus.DELIVERED) {
        throw new AppError(httpStatus.BAD_REQUEST, `Can't Do This Operation Right Now. The Parcel is ${isParcelExist.currentStatus}`);
    }

    isParcelExist.currentStatus = ParcelStatus.CONFIRMED;
    isParcelExist.parcelStatusLog.push({
        status: ParcelStatus.CONFIRMED,
        updatedBy: decodedToken.role,
        updaterId: decodedToken.userId,
    })
    await isParcelExist.save();

    return {
        data: isParcelExist
    }
};

// TRACK THE PARCEL ------
const trackParcel = async (trackingId: string) => {
    const isParcelExist = await Parcel.findOne({ trackingId });
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Tracking Id");
    }

    const senderInfo = await User.findOne({ email: isParcelExist.senderEmail });

    const result = {
        trackingId: isParcelExist.trackingId,
        parcelType: isParcelExist.parcelType,
        weight: isParcelExist.weight,
        codAmount: isParcelExist.codAmount,
        deliveryAddress: isParcelExist.deliveryAddress,
        senderName: senderInfo?.name,
        senderEmail: senderInfo?.email,
        senderPhone: senderInfo?.phone,
        receiverName: isParcelExist.receiverName,
        receiverEmail: isParcelExist.receiverEmail,
        receiverPhone: isParcelExist.receiverPhone,
        parcelStatusLog: isParcelExist.parcelStatusLog
    }

    return {
        data: result
    }
};

export const ParcelServices = {
    createParcel, getAllParcels, getAssignedParcels, getIncomingParcels, viewHistory, getMyParcels, getSingleParcel, manageParcel, updateParcelStatus, cancelParcel, confirmDelivery, trackParcel
}