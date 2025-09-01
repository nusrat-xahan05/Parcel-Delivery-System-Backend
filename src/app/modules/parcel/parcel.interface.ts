import { Types } from "mongoose";
import { Role } from "../user/user.interface";
import { Schema } from "mongoose";

export enum ServiceType {
    REGULAR = "REGULAR",
    SAME_DAY = "SAME DAY"
}

export enum DeliveryType {
    HOME = "HOME",
    ADDRESS_POINT = "ADDRESS POINT"
}

export enum ParcelType {
    FRAGILE = "FRAGILE",
    CLOTHES = "CLOTHES",
    ELECTRONICS = "ELECTRONICS",
    FOOD_ITEMS = "FOOD ITEMS",
    MEDICAL = "MEDICAL",
    DOCUMENTS = "DOCUMENTS",
    OTHERS = "OTHERS"
}

export enum ParcelStatus {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN TRANSIT",
    OUT_FOR_DELIVERY = "OUT FOR DELIVERY",
    DELIVERED = "DELIVERED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    BLOCKED = "BLOCKED"
}

export enum AgentParcelStatus {
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN TRANSIT",
    OUT_FOR_DELIVERY = "OUT FOR DELIVERY",
    DELIVERED = "DELIVERED",
}

export interface IParcelStatusLog {
    status: ParcelStatus;
    timeStamp?: Date;
    updatedBy: Role;
    updaterId: Types.ObjectId;
    location?: string;
}

export interface IParcel {
    _id?: Types.ObjectId;
    trackingId?: string;
    serviceType: ServiceType;
    deliveryType: DeliveryType;
    parcelType: ParcelType;
    senderEmail?: string;
    senderId?: {
        type: Schema.Types.ObjectId,
        ref: "User"
    };
    receiverName: string;
    receiverEmail: string;
    receiverPhone: string;
    pickUpAddress: string;
    deliveryAddress: string;
    weight: number;
    codAmount: number;  // COLLECT FROM CUSTOMER AMOUNT
    agentId?: {
        type: Schema.Types.ObjectId,
        ref: "User"
    };
    currentStatus: ParcelStatus;
    parcelStatusLog: IParcelStatusLog[];
}