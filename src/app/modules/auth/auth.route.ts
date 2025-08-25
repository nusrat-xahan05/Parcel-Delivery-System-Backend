import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginZodSchema } from "./auth.validation";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";


const router = Router()

// USER LOGIN ------
router.post('/login', validateRequest(loginZodSchema), checkAuth(...Object.values(Role)), AuthControllers.credentialsLogin);

// // CREATE ACCESSTOKEN FROM REFRESH TOKEN ------
// router.post('/refresh-token', checkAuth(...Object.values(Role)), AuthControllers.getNewAccessToken);

// USER LOGOUT ------
router.post('/logout', AuthControllers.logout);


export const AuthRoutes = router;