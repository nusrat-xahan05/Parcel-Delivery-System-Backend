import { AgentStatus, IUser, Role } from "./user.interface";
import { AgentRequest, User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { agentUserSearchableFields, userSearchableFields } from "./user.constant";
import { QueryBuilder } from "../../utils/queryBuilder";


// USER REGISTRATION ------ 
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role, ...rest } = payload;

    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist with This Email");
    }
    if ((role !== Role.SENDER) && (role !== Role.RECEIVER)) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can Only Register as 'SENDER' or 'RECEIVER'");
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
    const user = await User.create({
        email,
        password: hashedPassword,
        role,
        ...rest
    })

    return user;
}

// USER AGENT REQUEST ------
const createAgentRequest = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Do Not Exist with This Email");
    }

    if (isUserExist.agentStatus !== AgentStatus.NOT_REQUESTED) {
        throw new AppError(httpStatus.BAD_REQUEST, `Your Request is Already in ${isUserExist.agentStatus}`);
    }

    if (isUserExist) {
        isUserExist.agentStatus = AgentStatus.PENDING;
        await isUserExist.save();
    }

    const result = await AgentRequest.create({ userId: isUserExist._id });
    return result;
}

// GET CURRENT USER ------ 
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

// GET ALL USERS ------ 
const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};

// GET ALL AGENT REQUEST ------
const GetAllAgentRequest = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(AgentRequest.find().populate('userId'), query)
    const agentRequestUsersData = queryBuilder
        .filter()
        .search(agentUserSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        agentRequestUsersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};



export const UserServices = {
    createUser, createAgentRequest, getMe, getAllUsers, GetAllAgentRequest, getSingleUser
    // updateUser, reviewAgentRequest
}