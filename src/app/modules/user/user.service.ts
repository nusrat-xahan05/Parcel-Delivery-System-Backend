import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";


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



export const UserServices = {
    createUser,
    // createAgentRequest, GetAllAgentRequest, getAllUsers, getMe, getSingleUser, updateUser, reviewAgentRequest
}