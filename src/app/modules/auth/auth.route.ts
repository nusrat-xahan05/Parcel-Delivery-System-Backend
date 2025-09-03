import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginZodSchema } from "./auth.validation";


const router = Router()

// USER LOGIN ------
router.post('/login', validateRequest(loginZodSchema), AuthControllers.credentialsLogin);

// USER LOGOUT ------
router.post('/logout', AuthControllers.logout);


export const AuthRoutes = router;