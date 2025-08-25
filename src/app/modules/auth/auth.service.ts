import { IUser, UserStatus } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import AppError from "../../errorHelpers/appError";
import { createUserTokens } from "../../utils/userToken";


// USER LOGIN ------
const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Email Does Not Exist");
    }

    if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Is Not Verified");
    }

    if (isUserExist.userStatus === UserStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, `User Is ${isUserExist.userStatus}`);
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
    }

    const userTokens = createUserTokens(isUserExist);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

// // CREATE ACCESSTOKEN FROM REFRESH TOKEN ------
// const getNewAccessToken = async (refreshToken: string) => {
//     const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

//     return {
//         accessToken: newAccessToken
//     }
// }

export const AuthServices = {
    credentialsLogin,
    // getNewAccessToken, resetPassword
}