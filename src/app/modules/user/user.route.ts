import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";


const router = Router()

// USER REGISTRATION ------ (USER ENDPOINT)
router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser)

// USER AGENT REQUEST ------ (USER ENDPOINT)
// router.post('/agent-request', checkAuth(Role.SENDER, Role.RECEIVER), UserControllers.createAgentRequest);

// GET ME USER ------ (USER ENDPOINT)
// router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)

// GET ALL AGENT REQUEST ------ (ADMIN ENDPOINT)
// router.get('/all-agent-requests', checkAuth(Role.ADMIN), UserControllers.GetAllAgentRequest);

// GET ALL USERS ------ (ADMIN ENDPOINT)
// router.get('/all-users', checkAuth(Role.ADMIN), UserControllers.getAllUsers);

// GET SINGLE USER ------ (ADMIN ENDPOINT)
// router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser)

// USER PROFILE UPDATE, BLOCK CAN BE DONE BY ADMIN ------ (USER, ADMIN, AGENT ENDPOINT)
// router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)

// REVIEW AGENT REQUEST ------ (ADMIN ENDPOINT)
// router.post('/review-agent-request/:id', validateRequest(reviewAgentRequestZodSchema), checkAuth(Role.ADMIN), UserControllers.reviewAgentRequest);



export const UserRoutes = router;