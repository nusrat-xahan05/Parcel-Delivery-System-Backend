import mongoose, { model, Schema } from "mongoose";
import { DeliveryType, IParcel, IParcelStatusLog, ParcelStatus, ParcelType, ServiceType } from "./parcel.interface";
import { Role } from "../user/user.interface";


const parcelStatusLogSchema = new Schema<IParcelStatusLog>({
    status: {
        type: String,
        enum: Object.values(ParcelStatus),
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    updaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String
    }
}, {
    timestamps: false,
    _id: false,
    versionKey: false
})


const parcelSchema = new Schema<IParcel>({
    trackingId: {
        type: String
    },
    serviceType: {
        type: String,
        enum: Object.values(ServiceType),
        required: true
    },
    deliveryType: {
        type: String,
        enum: Object.values(DeliveryType),
        required: true
    },
    parcelType: {
        type: String,
        enum: Object.values(ParcelType),
        required: true
    },
    senderEmail: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    },
    receiverPhone: {
        type: String,
        required: true
    },
    pickUpAddress: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    codAmount: {
        type: Number,
        required: true
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentStatus: {
        type: String,
        enum: Object.values(ParcelStatus),
        required: true
    },
    parcelStatusLog: [parcelStatusLogSchema]
}, {
    timestamps: true,
    versionKey: false
})


export const Parcel = model<IParcel>("Parcel", parcelSchema);