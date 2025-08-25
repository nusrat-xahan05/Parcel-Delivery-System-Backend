import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginZodSchema } from "./auth.validation";


const router = Router()

// USER LOGIN ------
router.post('/login', validateRequest(loginZodSchema), AuthControllers.credentialsLogin);

// // CREATE ACCESSTOKEN FROM REFRESH TOKEN ------
// router.post('/refresh-token', checkAuth(...Object.values(Role)), AuthControllers.getNewAccessToken);

// USER LOGOUT ------
router.post('/logout', AuthControllers.logout);


export const AuthRoutes = router;