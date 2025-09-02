import { Types } from "mongoose";


export enum Role {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
}

export enum AgentStatus {
    NOT_REQUESTED = 'NOT_REQUESTED',
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface IAgentRequest {
    userId?: Types.ObjectId;
    agentStatus?: AgentStatus;
    reviewedBy?: Types.ObjectId;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Role;
    isVerified?: boolean;
    phone?: string;
    address?: string;
    userStatus?: UserStatus;
    agentStatus?: string;
    createdAt?: Date;
    updatedAt?: Date;
}