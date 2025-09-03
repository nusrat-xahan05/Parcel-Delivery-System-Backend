import z from "zod";
import { DeliveryType, ParcelStatus, ParcelType, ServiceType } from "./parcel.interface";
import { Role } from "../user/user.interface";


export const parcelStatusLogZodSchema = z.object({
    status: z
        .enum(Object.values(ParcelStatus) as [ParcelStatus, ...ParcelStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(ParcelStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
    timeStamp: z
        .string()
        .optional(),
    updatedBy: z
        .enum(Object.values(Role) as [Role, ...Role[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(Role).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Role Must Be 'SENDER' or 'RECEIVER'. '${val}' is Not Acceptable`,
                });
            }
        }),
    updaterId: z
        .string(),
    location: z
        .string()
        .optional()
});


export const createParcelZodSchema = z.object({
    trackingId: z
        .string()
        .optional(),
    serviceType: z
        .enum(Object.values(ServiceType) as [ServiceType, ...ServiceType[]])
        .optional()
        .refine((val) => val !== undefined, {
            message: "Service Type is Required",
        })
        .superRefine((val, ctx) => {
            if (val && !Object.values(ServiceType).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
    deliveryType: z
        .enum(Object.values(DeliveryType) as [DeliveryType, ...DeliveryType[]])
        .optional()
        .refine((val) => val !== undefined, {
            message: "Delivery Type is Required",
        })
        .superRefine((val, ctx) => {
            if (val && !Object.values(DeliveryType).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
    parcelType: z
        .enum(Object.values(ParcelType) as [ParcelType, ...ParcelType[]])
        .optional()
        .refine((val) => val !== undefined, {
            message: "Parcel Type is Required",
        })
        .superRefine((val, ctx) => {
            if (val && !Object.values(ParcelType).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
    senderEmail: z
        .string()
        .optional(),
    senderId: z
        .string()
        .optional(),
    receiverName: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Receiver Name is Required"
                : "Receiver Name Must Be a String"
        })
        .min(2, { message: "Receiver Name Too Short" })
        .max(50, { message: "Receiver Name Too Long" }),
    receiverEmail: z
        .email({ message: "Invalid Email Address Format" })
        .regex(
            // eslint-disable-next-line no-useless-escape
            /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
            { message: "Invalid Email Address Format" }
        )
        .transform((val) => val.toLowerCase()),
    receiverPhone: z
        .string({ error: "Phone Number Must Be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" }),
    pickUpAddress: z
        .string({
            error: (issue) => issue.input === undefined
                ? "PickUp Address is Required"
                : "PickUp Address Must Be a String"
        })
        .max(200, { message: "Pickup Address Cannot Exceed 400 Characters" }),
    deliveryAddress: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Delivery Address is Required"
                : "Delivery Address Must Be a String"
        })
        .max(200, { message: "Delivery Address Cannot Exceed 400 Characters" }),
    weight: z
        .number({
            error: (issue) => issue.input === undefined
                ? "Weight is Required"
                : "Weight Must Be a Number"
        }).min(.1, {
            message: 'Weight must be a Positive Number'
        }),
    codAmount: z
        .number({
            error: (issue) => issue.input === undefined
                ? "Cash On Delivery Amount is Required"
                : "Cash On Delivery Amount Must Be a Number"
        }).min(0, {
            message: 'Cash On Delivery Amount must be a Positive Number'
        }),
    agentId: z
        .string()
        .optional(),
    currentStatus: z
        .enum(Object.values(ParcelStatus) as [ParcelStatus, ...ParcelStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(ParcelStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
    parcelStatusLog: z
        .array(parcelStatusLogZodSchema)
        .optional()
})


export const manageParcelZodSchema = z.object({
    receiverPhone: z
        .string({ error: "Phone Number Must Be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" })
        .optional(),
    pickUpAddress: z
        .string({ error: "PickUp Address Must Be a String" })
        .max(200, { message: "Pickup Address Cannot Exceed 400 Characters" })
        .optional(),
    deliveryAddress: z
        .string({ error: "Delivery Address Must Be String" })
        .max(200, { message: "Delivery Address Cannot Exceed 400 Characters" })
        .optional(),
    codAmount: z
        .number({
            error: "Cash On Delivery Amount Must Be a String"
        })
        .min(0, {
            message: 'Cash On Delivery Amount must be a Positive Number'
        })
        .optional(),
    agentId: z
        .string({ error: 'Agent Id Must Be String' })
        .optional(),
    currentStatus: z
        .enum(Object.values(ParcelStatus) as [ParcelStatus, ...ParcelStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(ParcelStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
    parcelStatusLog: z
        .array(parcelStatusLogZodSchema)
        .optional()
}).refine((value) => {
    if ((value.currentStatus === ParcelStatus.APPROVED) && !value.agentId) {
        return false;
    }
    return true;
}, {
    message: "Need to Assign To An Agent as the Parcel is Approved"
})