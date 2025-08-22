import z from "zod";
import { UserStatus, Role, AgentStatus } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Name is Required"
                : "Name Must Be a String"
        })
        .min(3, { message: "Name is Too Short" })
        .max(50, { message: "Name is Too Long" }),
    email: z
        .email({ message: "Invalid Email Address Format" })
        .regex(
            // eslint-disable-next-line no-useless-escape
            /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
            { message: "Invalid Email Address Format" }
        )
        .transform((val) => val.toLowerCase()),
    password: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Password is Required"
                : "Password Must Be a String"
        })
        .min(8, { message: "Password Must Be At Least 8 Characters Long" })
        .regex(/^(?=.*[A-Z])/, { message: "Password Must Contain At Least 1 Uppercase Letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password Must Contain At Least 1 Special Character" })
        .regex(/^(?=.*\d)/, { message: "Password Must Contain At Least 1 Number" }),
    role: z
        .enum(Object.values(Role) as [Role, ...Role[]])
        .optional()
        .refine((val) => val !== undefined, {
            message: "Role is Required",
        })
        .superRefine((val, ctx) => {
            if (val && !Object.values(Role).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Role Must Be 'SENDER' or 'RECEIVER'. '${val}' is Not Acceptable`,
                });
            }
        }),
    isVerified: z
        .boolean({ error: "Verified Must Be True or False" })
        .optional(),
    phone: z
        .string({ error: "Phone Number Must Be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" })
        .optional(),
    address: z
        .string({ error: "Address Must Be String" })
        .max(200, { message: "Address Cannot Exceed 200 Characters" })
        .optional(),
    userStatus: z
        .enum(Object.values(UserStatus) as [UserStatus, ...UserStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(UserStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Status Must Be 'ACTIVE' or 'BLOCKED'. ${val} is Not Acceptable`,
                });
            }
        }),
    agentStatus: z
        .enum(Object.values(AgentStatus) as [AgentStatus, ...AgentStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(AgentStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        })
})


export const updateUserZodSchema = z.object({
    name: z
        .string({ error: "Name Must Be A String" })
        .min(3, { message: "Name is Too Short" })
        .max(50, { message: "Name is Too Long" })
        .optional(),
    role: z
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
    isVerified: z
        .boolean({ error: "Verified Must Be True or False" })
        .optional(),
    phone: z
        .string({ error: "Phone Number Must Be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" })
        .optional(),
    address: z
        .string({ error: "Address Must Be String" })
        .max(200, { message: "Address Cannot Exceed 200 Characters" })
        .optional(),
    userStatus: z
        .enum(Object.values(UserStatus) as [UserStatus, ...UserStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(UserStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Status Must Be 'ACTIVE' or 'BLOCKED'. ${val} is Not Acceptable`,
                });
            }
        }),
    agentStatus: z
        .enum(Object.values(AgentStatus) as [AgentStatus, ...AgentStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(AgentStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
})


export const agentRequestReviewZodSchema = z.object({
    userId: z
        .string({
            error: (issue) => issue.input === undefined
                ? "UserId is Required"
                : "UserId Must Be a String"
        })
        .optional(),
    agentStatus: z
        .enum(Object.values(AgentStatus) as [AgentStatus, ...AgentStatus[]])
        .optional()
        .superRefine((val, ctx) => {
            if (val && !Object.values(AgentStatus).includes(val)) {
                ctx.addIssue({
                    code: "custom",
                    message: `${val} is Not Acceptable`,
                });
            }
        }),
    reviewedBy: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Reviewer is Required"
                : "Reviewer Must Be a String"
        })
        .optional()
})
